const Attendance = require('../Models/Attendance');
const Employee = require('../Models/Employee');
const moment = require('moment-timezone');

exports.getLoggedInEmployeeAttendance = async (req, res) => {
 
  const now = moment().tz('Asia/Karachi');

  let shiftStart = now.clone().hour(9).minute(0).second(0); 
  let shiftEnd = shiftStart.clone().add(1, 'day').subtract(1, 'second');

  if (now.isBefore(shiftStart)) {
    shiftStart.subtract(1, 'day');
    shiftEnd.subtract(1, 'day');
  }

  console.log(`Shift Start: ${shiftStart.format('YYYY-MM-DD HH:mm:ss')}`);
  console.log(`Shift End: ${shiftEnd.format('YYYY-MM-DD HH:mm:ss')}`);
  try {
    const loggedInRecords = await Attendance.find({ is_logged_in: true })
      .populate({
        path: 'employee',
        select: 'name email designation',
        populate: { path: 'designation', select: 'role' },
      })
      .lean();
  
    if (loggedInRecords.length === 0) {
      console.warn('No logged-in records found.');
    }

    const loggedInDates = [...new Set(loggedInRecords.map(record => record.date.toISOString().split('T')[0]))];

    const loggedOutRecords = await Attendance.find({ is_logged_in: false })
      .populate('employee', 'name email')
      .lean();

    const filteredLoggedOutRecords = loggedOutRecords.filter(record =>
      loggedInDates.includes(record.date.toISOString().split('T')[0])
    );

    const combinedRecords = [...loggedInRecords, ...filteredLoggedOutRecords];

    const totalEmployees = await Employee.countDocuments();

    const responseData = combinedRecords.map(record => {
      const { employee, in_time, out_time, is_logged_in, date } = record;
      return {
        employeeId: employee?._id || 'Unknown',
        employeeName: employee?.name || 'Unknown',
        employeeEmail: employee?.email || 'Unknown',
        designation: employee?.designation?.role || 'Unknown',
        loginTime: in_time || 'Not Logged In',
        logoutTime: is_logged_in ? 'Not Logged Out Yet' : out_time || 'Not Logged Out Yet',
        isLoggedIn: is_logged_in,
        date: date.toISOString().split('T')[0],
        totalEmployees
      };
    });

    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching employee attendance summary:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params; // Get employeeId from URL params

    console.log(employeeId);
    // Validate if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Fetch all attendance records for the employee
    const attendanceRecords = await Attendance.find({ employee: employeeId })
      .populate('employee', 'name email')
      .lean();

    if (attendanceRecords.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for this employee' });
    }

    // Format attendance records
    const formattedRecords = attendanceRecords.map(record => {
      const { in_time, out_time, is_logged_in, date } = record;
      return {
        loginTime: in_time || 'Not Logged In',
        logoutTime: is_logged_in ? 'Not Logged Out Yet' : out_time || 'Not Logged Out Yet',
        isLoggedIn: is_logged_in,
        date: date.toISOString().split('T')[0],
        employee,
      };
    });

    console.log(formattedRecords);

    return res.status(200).json(formattedRecords);

  } catch (error) {
    console.error('Error fetching employee attendance:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
