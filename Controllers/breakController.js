const moment = require('moment-timezone');
const Attendance = require('../Models/Attendance');
const Break = require('../Models/Break');

exports.startBreak = async (req, res) => {
  try {
    const { attendanceId, break_type, notes } = req.body;
    const now = moment().tz('Asia/Karachi').format('HH:mm:ss');

    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) return res.status(404).json({ error: 'Attendance record not found' });

    const breakRecord = await Break.create({
      attendance: attendanceId,
      break_start: now,
      break_type,
      notes,
      is_break_in: true,
    });

    attendance.breaks.push(breakRecord._id);
    await attendance.save();

    res.status(200).json({
      message: 'Break started successfully',
      breakId: breakRecord._id,
      breakStart: breakRecord.break_start,
      breakType: breakRecord.break_type,
      notes: breakRecord.notes,
      is_break_in: breakRecord.is_break_in,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.endBreak = async (req, res) => {
  try {
    const { breakId } = req.body;
    const now = moment().tz('Asia/Karachi').format('HH:mm:ss');

    // Find the break record
    const breakRecord = await Break.findById(breakId);
    if (!breakRecord || breakRecord.break_end) {
      return res.status(400).json({ error: 'Break not found or already ended' });
    }

    // Calculate break duration
    const duration = moment
      .duration(moment(now, 'HH:mm:ss').diff(moment(breakRecord.break_start, 'HH:mm:ss')))
      .asMinutes();

    // Update the break record
    Object.assign(breakRecord, { break_end: now, break_duration: duration });
    await breakRecord.save();

    // Update attendance record to set is_break_in to false
    await Attendance.updateOne(
      { breaks: breakId },
      { $set: { is_logged_in: true, is_break_in: false } }
    );

    res.status(200).json({
      message: 'Break ended successfully',
      breakId: breakRecord._id,
      breakStart: breakRecord.break_start,
      breakEnd: breakRecord.break_end,
      breakDuration: breakRecord.break_duration,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

