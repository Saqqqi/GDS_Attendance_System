
const Authentication = require("../Models/Authentication");
const Designation = require("../Models/Designation");
const Employee = require("../Models/Employee");


module.exports.createEmployee = async (req, res) => {
  console.log("Incoming Request to createEmployee:");
  console.log("Request Body:", JSON.stringify(req.body, null, 2));
  console.log(req.body);

  try {
      // Extract 'designation', 'role', 'CNIC' from the request body
      const { designation, CNIC_No, email, role_company, ...employeeData } = req.body;
      console.log("Designation:", designation);
      console.log("Role:", role_company); // Changed to role from Compnay_role

      // Validate 'designation'
      if (!['Admin', 'Sales', 'Developer', 'IT', 'Designer', 'Agency', 'Lead'].includes(designation)) {
          return res.status(400).json({ message: 'Invalid designation name.' });
      }

      // Check for duplicate CNIC or email
      if (await Employee.findOne({ CNIC_No })) {
          return res.status(400).json({ message: 'CNIC already exists.' });
      }

      if (await Employee.findOne({ email })) {
          return res.status(400).json({ message: 'Email already exists.' });
      }

      // Find or create the designation
      const roleDesignation = await Designation.findOneAndUpdate(
          { role: designation },
          { $setOnInsert: { role: designation, employees: [] } },
          { new: true, upsert: true }
      );

      // Create the employee
      const savedEmployee = await new Employee({
          ...employeeData,
          CNIC_No,
          email,
          role_company, // Use the main role from the request body
          designation: roleDesignation._id,
      }).save();

      // Link the employee to the designation
      roleDesignation.employees.push(savedEmployee._id);
      await roleDesignation.save();

      // Create authentication entry
      await new Authentication({
          Secretkey: CNIC_No.slice(-6),
          employeeId: savedEmployee._id,
          designation: roleDesignation._id,
      }).save();

      res.status(201).json(savedEmployee);
      console.log('Employee Registered Successfully.!', savedEmployee);
  } catch (err) {
      console.error(err);
      res.status(err.code === 11000 ? 400 : 500).json({
          message: err.code === 11000 ? 'Duplicate entry.' : 'Server Error',
          error: err.message,
      });
  }
};


  // Get all employees
  module.exports.getAllEmployees = async (req, res) => {
    try {
      // Fetch all employees from the database
      const employees = await Employee.find();
      // Count the total employees
    const totalEmployees = await Employee.countDocuments();

      if (!employees || employees.length === 0) {
        return res.status(404).json({ message: 'No employees found.' });
      }

      console.log("Employees Count: ",totalEmployees);

      res.status(200).json({ 
        message: 'Employees retrieved successfully.', 
        employees,
        totalEmployees
      });
    } catch (err) {
      res.status(500).json({ 
        message: 'Server Error', 
        error: err.message 
      });
    }
  };

  // Get an employee by ID API
  module.exports.getEmployeeById = async (req, res) => {
    console.log("working.....");
    const { id } = req.params;
  
    try {
      // Find the employee by ID and populate the 'designation' field
      const employee = await Employee.findById(id).populate('designation');
  
      // Check if employee exists
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found.' });
      }
  
      // Respond with employee and designation data
      res.status(200).json({
        message: 'Employee details retrieved successfully.',
        employee,
      });
    } catch (err) {
      res.status(500).json({
        message: 'Server Error',
        error: err.message,
      });
    }
  };

  module.exports.updateEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params; 
        console.log("🔹 req.params:", req.params);
        console.log("🔹 Employee ID:", employeeId);

        if (!employeeId) {
            return res.status(400).json({ message: '❌ Employee ID is required in URL params.' });
        }

        const {
            name,
            email,
            address,
            in_time,
            out_time,
            joining_date,
            role_company,
            CNIC_No,
            role_name
        } = req.body;

        console.log("🔹 Request Body:", { name, email, address, in_time, out_time, joining_date, CNIC_No, role_name ,role_company,});

        if (!name || !email || !address || !joining_date) {
            return res.status(400).json({ message: '❌ Missing required fields (name, email, address, joining_date).' });
        }

        const employee = await Employee.findById(employeeId);
        console.log("🔹 Employee Details:", employee);

        if (!employee) {
            return res.status(404).json({ message: '❌ Employee not found.' });
        }

        if (email && email !== employee.email) {
            const existingEmail = await Employee.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: '❌ Email already in use by another employee.' });
            }
        }

        employee.name = name || employee.name;
        employee.email = email || employee.email;
        employee.address = address || employee.address;
        employee.in_time = in_time || employee.in_time;
        employee.out_time = out_time || employee.out_time;
        employee.role_company = role_company || employee.role_company;
        employee.joining_date = joining_date || employee.joining_date;

        if (CNIC_No && CNIC_No !== employee.CNIC_No) {
            employee.CNIC_No = CNIC_No;

            const auth = await Authentication.findOne({ employeeId });
            if (auth) {
                auth.Secretkey = CNIC_No.slice(-6);
                await auth.save();
            }
        }

        let roleDesignation = await Designation.findOne({ role: role_name });
        if (!roleDesignation) {
            roleDesignation = new Designation({
                role: role_name,
                employees: []
            });
            await roleDesignation.save();
        }

        employee.designation = roleDesignation._id;

        if (!roleDesignation.employees.includes(employee._id)) {
            roleDesignation.employees.push(employee._id);
            await roleDesignation.save();
        }

        await employee.save();

        console.log("Record Updated Successfully.", employee);

        res.status(200).json({
            message: '✅ Employee updated successfully!',
            employee
        });

    } catch (err) {
        console.error('❌ Error updating employee:', err.message);
        res.status(500).json({
            message: '❌ Server Error. Failed to update employee.',
            error: err.message
        });
    }
};




// Delete API
module.exports.deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params; 
    console.log("req params: ", req.params);
    console.log("Employee Id: ", employeeId);

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found.' });

    await Employee.findByIdAndDelete(employeeId);

    console.log('Employee Deleted Successfully', employeeId);

    res.status(200).json({ message: 'Employee and related data deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};





  