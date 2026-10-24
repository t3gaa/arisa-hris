import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabaseClient";

/* =========================
   HELPERS
========================= */

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const getNetSalary = (item) =>
  (Number(item.basic) || 0) +
  (Number(item.allowance) || 0) -
  (Number(item.deduction) || 0);

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB");
};

const getToday = () => {
  const date = new Date();
  return date.toISOString().split("T")[0];
};

const navItems = [
  { id: "Dashboard", icon: "⌂" },
  { id: "Employees", icon: "♙" },
  { id: "Attendance", icon: "✓" },
  { id: "Leave", icon: "◷" },
  { id: "Payroll", icon: "₦" },
  { id: "Performance", icon: "★" },
  { id: "Recruitment", icon: "♧" },
  { id: "Analytics", icon: "▥" },
];

/* =========================
   LOGIN
========================= */

function LoginPage({ onLogin }) {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [adminCredentials] = useState(() => {
    const savedCredentials = localStorage.getItem(
      "arisaAdminCredentials"
    );

    if (savedCredentials) {
      try {
        return JSON.parse(savedCredentials);
      } catch {
        return {
          email: "admin@arisa.com",
          password: "Arisa123!",
        };
      }
    }

    return {
      email: "admin@arisa.com",
      password: "Arisa123!",
    };
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    setLoginError("");

    const enteredEmail = loginForm.email.trim().toLowerCase();

    if (
      enteredEmail ===
        adminCredentials.email.trim().toLowerCase() &&
      loginForm.password === adminCredentials.password
    ) {
      if (rememberMe) {
        localStorage.setItem("arisaAuth", "true");
        sessionStorage.removeItem("arisaAuth");
      } else {
        sessionStorage.setItem("arisaAuth", "true");
        localStorage.removeItem("arisaAuth");
      }

      onLogin();
      return;
    }

    setLoginError("Incorrect email or password.");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #e0e7ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          borderRadius: "18px",
          padding: "38px",
          boxShadow: "0 20px 60px rgba(15,23,42,0.12)",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              width: "62px",
              height: "62px",
              margin: "0 auto 16px",
              borderRadius: "16px",
              background: "#4f46e5",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              fontWeight: "800",
            }}
          >
            AR
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "25px",
              color: "#111827",
            }}
          >
            ARISA
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: "6px",
              fontSize: "14px",
            }}
          >
            Human Resource Information System
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email Address"
            type="email"
            value={loginForm.email}
            onChange={(value) =>
              setLoginForm((current) => ({
                ...current,
                email: value,
              }))
            }
            placeholder="admin@arisa.com"
            required
          />

          <div style={{ marginTop: "16px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "700",
                fontSize: "13px",
                marginBottom: "7px",
                color: "#374151",
              }}
            >
              Password
            </label>

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                placeholder="Enter your password"
                required
                style={{
                  width: "100%",
                  padding: "11px 45px 11px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "16px 0",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(event.target.checked)
                }
              />
              Remember me
            </label>
          </div>

          {loginError && (
            <div
              style={{
                background: "#fef2f2",
                color: "#dc2626",
                border: "1px solid #fecaca",
                padding: "11px",
                borderRadius: "8px",
                fontSize: "13px",
                marginBottom: "15px",
              }}
            >
              {loginError}
            </div>
          )}

          <button
            type="submit"
            style={{
              ...primaryButton,
              width: "100%",
              padding: "13px",
              fontSize: "14px",
            }}
          >
            Sign In
          </button>
        </form>

        <div
          style={{
            marginTop: "25px",
            padding: "14px",
            background: "#f8fafc",
            borderRadius: "10px",
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          <strong
            style={{
              display: "block",
              color: "#334155",
              marginBottom: "7px",
            }}
          >
            Demo Credentials
          </strong>

          <div>Email: {adminCredentials.email}</div>
          <div>Password: {adminCredentials.password}</div>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "11px",
            marginTop: "25px",
            marginBottom: 0,
          }}
        >
          © 2026 ARISA HRIS
        </p>
      </div>
    </div>
  );
}

/* =========================
   MAIN APP
========================= */

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () =>
      localStorage.getItem("arisaAuth") === "true" ||
      sessionStorage.getItem("arisaAuth") === "true"
  );

  const [activePage, setActivePage] = useState("Dashboard");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmployeeForm, setShowEmployeeForm] =
    useState(false);
  const [editingEmployeeId, setEditingEmployeeId] =
    useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] =
    useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);

  const [employeesLoading, setEmployeesLoading] =
    useState(true);
  const [attendanceLoading, setAttendanceLoading] =
    useState(true);
  const [leaveLoading, setLeaveLoading] = useState(true);
  const [payrollLoading, setPayrollLoading] =
    useState(true);
  const [performanceLoading, setPerformanceLoading] =
    useState(true);
  const [recruitmentLoading, setRecruitmentLoading] =
    useState(true);

  const [attendanceError, setAttendanceError] =
    useState("");

  const [employeeForm, setEmployeeForm] = useState({
  name: "",
  department: "",
  position: "",
  email: "",
  phone: "",
  employmentType: "Full-time",
  dateJoined: "",
});

  const [leaveForm, setLeaveForm] = useState({
    employeeId: "",
    type: "Annual Leave",
    start: "",
    end: "",
    reason: "",
  });

  const [performanceForm, setPerformanceForm] =
    useState({
      employeeId: "",
      period: "",
      rating: "3",
      goal: "",
    });

  const [applicantForm, setApplicantForm] = useState({
    name: "",
    jobId: "",
    applicationDate: getToday(),
  });

  const [editingPayrollId, setEditingPayrollId] =
    useState(null);

  const [payrollForm, setPayrollForm] = useState({
    basic: "",
    allowance: "",
    deduction: "",
  });

  /* =========================
     ADMIN CREDENTIALS
  ========================= */

  const [adminCredentials, setAdminCredentials] =
    useState(() => {
      const savedCredentials = localStorage.getItem(
        "arisaAdminCredentials"
      );

      if (savedCredentials) {
        try {
          return JSON.parse(savedCredentials);
        } catch {
          return {
            email: "admin@arisa.com",
            password: "Arisa123!",
          };
        }
      }

      return {
        email: "admin@arisa.com",
        password: "Arisa123!",
      };
    });

  const [settingsForm, setSettingsForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [settingsMessage, setSettingsMessage] =
    useState("");

  const [settingsError, setSettingsError] =
    useState("");

  useEffect(() => {
    setSettingsForm({
      email: adminCredentials.email,
      password: "",
      confirmPassword: "",
    });
  }, [adminCredentials]);

  const saveAdminCredentials = () => {
    setSettingsMessage("");
    setSettingsError("");

    const email = settingsForm.email.trim();
    const password = settingsForm.password;
    const confirmPassword =
      settingsForm.confirmPassword;

    if (!email) {
      setSettingsError("Please enter an admin email.");
      return;
    }

    if (!email.includes("@")) {
      setSettingsError(
        "Please enter a valid email address."
      );
      return;
    }

    if (!password) {
      setSettingsError(
        "Please enter a new password."
      );
      return;
    }

    if (password.length < 6) {
      setSettingsError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setSettingsError(
        "Passwords do not match."
      );
      return;
    }

    const updatedCredentials = {
      email,
      password,
    };

    localStorage.setItem(
      "arisaAdminCredentials",
      JSON.stringify(updatedCredentials)
    );

    setAdminCredentials(updatedCredentials);

    setSettingsForm({
      email,
      password: "",
      confirmPassword: "",
    });

    setSettingsMessage(
      "Admin credentials updated successfully."
    );
  };

  /* =========================
     FETCH EMPLOYEES
  ========================= */

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmployeesLoading(true);

      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("created_at", {
          ascending: true,
        });

      if (error) {
        console.error("Employees fetch error:", error);
      } else {
        setEmployees(
  (data || []).map((employee) => ({
    id: employee.employee_id,
    name: employee.name,
    department: employee.department,
    position: employee.position,
    email: employee.email,
    phone: employee.phone,
    employmentType: employee.employment_type,
    dateJoined: employee.date_joined,
  }))
);
      }

      setEmployeesLoading(false);
    };

    fetchEmployees();
  }, []);

  /* =========================
     FETCH ATTENDANCE
  ========================= */

  useEffect(() => {
    const fetchAttendance = async () => {
      setAttendanceLoading(true);
      setAttendanceError("");

      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("attendance_date", getToday());

      if (error) {
        console.error(
          "Attendance fetch error:",
          error
        );

        setAttendanceError(
          "Unable to load today's attendance."
        );
      } else {
        setAttendance(
          (data || []).map((item) => ({
            id: item.id,
            employeeId: item.employee_id,
            status: item.status,
          }))
        );
      }

      setAttendanceLoading(false);
    };

    fetchAttendance();
  }, []);

  /* =========================
     FETCH LEAVE
  ========================= */

  useEffect(() => {
    const fetchLeave = async () => {
      setLeaveLoading(true);

      const { data, error } = await supabase
        .from("leave_requests")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error("Leave fetch error:", error);
      } else {
        setLeaveRequests(
          (data || []).map((item) => ({
            id: item.id,
            employeeId: item.employee_id,
            employee: item.employee_name,
            type: item.leave_type,
            start: item.start_date,
            end: item.end_date,
            reason: item.reason,
            status: item.status,
          }))
        );
      }

      setLeaveLoading(false);
    };

    fetchLeave();
  }, []);

  /* =========================
     FETCH PAYROLL
  ========================= */

  useEffect(() => {
    const fetchPayroll = async () => {
      setPayrollLoading(true);

      const { data, error } = await supabase
        .from("payroll")
        .select("*")
        .order("created_at", {
          ascending: true,
        });

      if (error) {
        console.error("Payroll fetch error:", error);
      } else {
        setPayroll(
          (data || []).map((item) => ({
            id: item.id,
            employeeId: item.employee_id,
            basic: Number(item.basic_salary) || 0,
            allowance: Number(item.allowances) || 0,
            deduction: Number(item.deductions) || 0,
            status: item.status,
          }))
        );
      }

      setPayrollLoading(false);
    };

    fetchPayroll();
  }, []);

  /* =========================
     FETCH PERFORMANCE
  ========================= */

  useEffect(() => {
    const fetchPerformance = async () => {
      setPerformanceLoading(true);

      const { data, error } = await supabase
        .from("performance_reviews")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "Performance fetch error:",
          error
        );
      } else {
        setPerformance(
          (data || []).map((item) => ({
            id: item.id,
            employeeId: item.employee_id,
            employee: item.employee_name,
            period: item.review_period,
            rating: Number(item.rating) || 0,
            goal: item.goal,
            status: item.status,
          }))
        );
      }

      setPerformanceLoading(false);
    };

    fetchPerformance();
  }, []);

  /* =========================
     FETCH RECRUITMENT
  ========================= */

  useEffect(() => {
    const fetchRecruitment = async () => {
      setRecruitmentLoading(true);

      const {
        data: jobsData,
        error: jobsError,
      } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", {
          ascending: true,
        });

      if (jobsError) {
        console.error(
          "Jobs fetch error:",
          jobsError
        );
      } else {
        setJobs(
          (jobsData || []).map((job) => ({
            id: job.id,
            jobId: job.job_id,
            title: job.title,
            department: job.department,
            openings: job.openings,
            applicants: job.applicants,
            status: job.status,
          }))
        );
      }

      const {
        data: applicantsData,
        error: applicantsError,
      } = await supabase
        .from("applicants")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (applicantsError) {
        console.error(
          "Applicants fetch error:",
          applicantsError
        );
      } else {
        setApplicants(
          (applicantsData || []).map((item) => ({
            id: item.id,
            name: item.name,
            position: item.position,
            department: item.department,
            applicationDate: item.application_date,
            status: item.status,
          }))
        );
      }

      setRecruitmentLoading(false);
    };

    fetchRecruitment();
  }, []);

  /* =========================
     DERIVED DATA
  ========================= */

  const presentCount = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const lateCount = attendance.filter(
    (item) => item.status === "Late"
  ).length;

  const absentCount = attendance.filter(
    (item) => item.status === "Absent"
  ).length;

  const pendingLeave = leaveRequests.filter(
    (item) => item.status === "Pending"
  ).length;

  const approvedLeave = leaveRequests.filter(
    (item) => item.status === "Approved"
  ).length;

  const pendingReviews = performance.filter(
    (item) => item.status === "Pending"
  ).length;

  const completedReviews = performance.filter(
    (item) => item.status === "Completed"
  ).length;

  const averageRating =
    performance.length > 0
      ? (
          performance.reduce(
            (sum, item) =>
              sum + Number(item.rating || 0),
            0
          ) / performance.length
        ).toFixed(1)
      : "0.0";

  const openPositions = jobs.filter(
    (job) => job.status === "Open"
  ).length;

  const hiredCount = applicants.filter(
    (item) => item.status === "Hired"
  ).length;

  const grossPayroll = payroll.reduce(
    (sum, item) =>
      sum + Number(item.basic || 0),
    0
  );

  const totalAllowances = payroll.reduce(
    (sum, item) =>
      sum + Number(item.allowance || 0),
    0
  );

  const totalDeductions = payroll.reduce(
    (sum, item) =>
      sum + Number(item.deduction || 0),
    0
  );

  const netPayroll =
    grossPayroll +
    totalAllowances -
    totalDeductions;

  const attendanceRate =
    employees.length > 0
      ? Math.round(
          (presentCount / employees.length) * 100
        )
      : 0;

  const departmentStats = useMemo(() => {
    const counts = {};

    employees.forEach((employee) => {
      counts[employee.department] =
        (counts[employee.department] || 0) + 1;
    });

    return Object.entries(counts).map(
      ([department, count]) => ({
        department,
        count,
        percentage:
          employees.length > 0
            ? Math.round(
                (count / employees.length) * 100
              )
            : 0,
      })
    );
  }, [employees]);

  const recruitmentPipeline = useMemo(() => {
    const statuses = [
      "Applied",
      "Screening",
      "Interview",
      "Offer",
      "Hired",
    ];

    return statuses.map((status) => ({
      status,
      count: applicants.filter(
        (item) => item.status === status
      ).length,
    }));
  }, [applicants]);

  const filteredEmployees = employees.filter(
    (employee) => {
      const search = searchTerm.toLowerCase();

      return (
        employee.name
          .toLowerCase()
          .includes(search) ||
        employee.id
          .toLowerCase()
          .includes(search) ||
        employee.department
          .toLowerCase()
          .includes(search) ||
        employee.position
          .toLowerCase()
          .includes(search) ||
        employee.email
          .toLowerCase()
          .includes(search)
      );
    }
  );

  const currentDate = new Date().toLocaleDateString(
    "en-GB",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  /* =========================
     AUTH
  ========================= */

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("arisaAuth");
    sessionStorage.removeItem("arisaAuth");

    setIsAuthenticated(false);
    setActivePage("Dashboard");
    setSelectedEmployee(null);
  };

  /* =========================
     ATTENDANCE
  ========================= */

  const updateAttendance = async (
    employeeId,
    status
  ) => {
    const existing = attendance.find(
      (item) => item.employeeId === employeeId
    );

    if (existing) {
      const { error } = await supabase
        .from("attendance")
        .update({
          status,
        })
        .eq("id", existing.id);

      if (error) {
        console.error(
          "Attendance update error:",
          error
        );

        alert(
          "Unable to update attendance."
        );

        return;
      }

      setAttendance((current) =>
        current.map((item) =>
          item.id === existing.id
            ? {
                ...item,
                status,
              }
            : item
        )
      );
    } else {
      const {
        data,
        error,
      } = await supabase
        .from("attendance")
        .insert({
          employee_id: employeeId,
          attendance_date: getToday(),
          status,
        })
        .select("*")
        .single();

      if (error) {
        console.error(
          "Attendance insert error:",
          error
        );

        alert(
          "Unable to save attendance."
        );

        return;
      }

      setAttendance((current) => [
        ...current,
        {
          id: data.id,
          employeeId: data.employee_id,
          status: data.status,
        },
      ]);
    }
  };

  /* =========================
     LEAVE
  ========================= */

  const handleLeaveSubmit = async (
    event
  ) => {
    event.preventDefault();

    const employee = employees.find(
      (item) =>
        item.id === leaveForm.employeeId
    );

    if (!employee) return;

    const {
      data,
      error,
    } = await supabase
      .from("leave_requests")
      .insert({
        employee_id: employee.id,
        employee_name: employee.name,
        leave_type: leaveForm.type,
        start_date: leaveForm.start,
        end_date: leaveForm.end,
        reason: leaveForm.reason,
        status: "Pending",
      })
      .select("*")
      .single();

    if (error) {
      console.error(
        "Leave insert error:",
        error
      );

      alert(
        "Unable to submit leave request."
      );

      return;
    }

    setLeaveRequests((current) => [
      {
        id: data.id,
        employeeId: data.employee_id,
        employee: data.employee_name,
        type: data.leave_type,
        start: data.start_date,
        end: data.end_date,
        reason: data.reason,
        status: data.status,
      },
      ...current,
    ]);

    setLeaveForm({
      employeeId: "",
      type: "Annual Leave",
      start: "",
      end: "",
      reason: "",
    });
  };

  const updateLeaveStatus = async (
    id,
    status
  ) => {
    const { error } = await supabase
      .from("leave_requests")
      .update({
        status,
      })
      .eq("id", id);

    if (error) {
      console.error(
        "Leave status update error:",
        error
      );

      alert(
        "Unable to update leave request."
      );

      return;
    }

    setLeaveRequests((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item
      )
    );
  };

  /* =========================
     PAYROLL
  ========================= */

  const startPayrollEdit = (item) => {
    setEditingPayrollId(item.id);

    setPayrollForm({
      basic: String(item.basic),
      allowance: String(item.allowance),
      deduction: String(item.deduction),
    });
  };

  const cancelPayrollEdit = () => {
    setEditingPayrollId(null);

    setPayrollForm({
      basic: "",
      allowance: "",
      deduction: "",
    });
  };

  const savePayroll = async (item) => {
    const basic =
      Number(payrollForm.basic) || 0;

    const allowance =
      Number(payrollForm.allowance) || 0;

    const deduction =
      Number(payrollForm.deduction) || 0;

    const { error } = await supabase
      .from("payroll")
      .update({
        basic_salary: basic,
        allowances: allowance,
        deductions: deduction,
      })
      .eq("id", item.id);

    if (error) {
      console.error(
        "Payroll update error:",
        error
      );

      alert(
        "Unable to update payroll."
      );

      return;
    }

    setPayroll((current) =>
      current.map((row) =>
        row.id === item.id
          ? {
              ...row,
              basic,
              allowance,
              deduction,
            }
          : row
      )
    );

    cancelPayrollEdit();
  };

  const updatePayrollStatus = async (
    id,
    employeeId,
    status
  ) => {
    const { error } = await supabase
      .from("payroll")
      .update({
        status,
      })
      .eq("id", id);

    if (error) {
      console.error(
        "Payroll status update error:",
        error
      );

      alert(
        "Unable to update payroll status."
      );

      return;
    }

    setPayroll((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item
      )
    );
  };

  /* =========================
     PERFORMANCE
  ========================= */

  const handlePerformanceSubmit = async (
    event
  ) => {
    event.preventDefault();

    const employee = employees.find(
      (item) =>
        item.id ===
        performanceForm.employeeId
    );

    if (!employee) return;

    const {
      data,
      error,
    } = await supabase
      .from("performance_reviews")
      .insert({
        employee_id: employee.id,
        employee_name: employee.name,
        review_period:
          performanceForm.period,
        rating: Number(
          performanceForm.rating
        ),
        goal: performanceForm.goal,
        status: "Pending",
      })
      .select("*")
      .single();

    if (error) {
      console.error(
        "Performance insert error:",
        error
      );

      alert(
        "Unable to create performance review."
      );

      return;
    }

    setPerformance((current) => [
      {
        id: data.id,
        employeeId: data.employee_id,
        employee: data.employee_name,
        period: data.review_period,
        rating:
          Number(data.rating) || 0,
        goal: data.goal,
        status: data.status,
      },
      ...current,
    ]);

    setPerformanceForm({
      employeeId: "",
      period: "",
      rating: "3",
      goal: "",
    });
  };

  const updatePerformanceStatus = async (
    id,
    status
  ) => {
    const { error } = await supabase
      .from("performance_reviews")
      .update({
        status,
      })
      .eq("id", id);

    if (error) {
      console.error(
        "Performance status update error:",
        error
      );

      alert(
        "Unable to update performance review."
      );

      return;
    }

    setPerformance((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item
      )
    );
  };

  /* =========================
     RECRUITMENT
  ========================= */

  const handleApplicantSubmit = async (
    event
  ) => {
    event.preventDefault();

    const job = jobs.find(
      (item) =>
        String(item.id) ===
        String(applicantForm.jobId)
    );

    if (!job) return;

    const {
      data,
      error,
    } = await supabase
      .from("applicants")
      .insert({
        name: applicantForm.name,
        position: job.title,
        department: job.department,
        application_date:
          applicantForm.applicationDate,
        status: "Applied",
      })
      .select("*")
      .single();

    if (error) {
      console.error(
        "Applicant insert error:",
        error
      );

      alert(
        "Unable to add applicant."
      );

      return;
    }

    setApplicants((current) => [
      {
        id: data.id,
        name: data.name,
        position: data.position,
        department: data.department,
        applicationDate:
          data.application_date,
        status: data.status,
      },
      ...current,
    ]);

    setJobs((current) =>
      current.map((item) =>
        item.id === job.id
          ? {
              ...item,
              applicants:
                Number(
                  item.applicants || 0
                ) + 1,
            }
          : item
      )
    );

    await supabase
      .from("jobs")
      .update({
        applicants:
          Number(job.applicants || 0) + 1,
      })
      .eq("id", job.id);

    setApplicantForm({
      name: "",
      jobId: "",
      applicationDate: getToday(),
    });
  };

  const updateApplicantStatus = async (
    id,
    status
  ) => {
    const { error } = await supabase
      .from("applicants")
      .update({
        status,
      })
      .eq("id", id);

    if (error) {
      console.error(
        "Applicant status update error:",
        error
      );

      alert(
        "Unable to update applicant."
      );

      return;
    }

    setApplicants((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item
      )
    );
  };

  /* =========================
     EMPLOYEES
  ========================= */

  const handleEmployeeSubmit = async (
    event
  ) => {
    event.preventDefault();

    const employeeNumbers = employees
      .map((employee) =>
        Number(
          employee.id.replace("TH", "")
        )
      )
      .filter(
        (number) => !Number.isNaN(number)
      );

    const nextEmployeeNumber =
  employeeNumbers.length > 0
    ? Math.max(...employeeNumbers) + 1
    : employees.length + 1;
    const newEmployeeId = `TH${String(
      nextEmployeeNumber
    ).padStart(3, "0")}`;

    const {
      data,
      error,
    } = await supabase
      .from("employees")
      .insert({
  employee_id: newEmployeeId,
  name: employeeForm.name,
  department: employeeForm.department,
  position: employeeForm.position,
  email: employeeForm.email,
  phone: employeeForm.phone,
  employment_type: employeeForm.employmentType,
  date_joined: employeeForm.dateJoined,
  status: "Active",
})
      .select("*")
      .single();

    if (error) {
      console.error(
        "Supabase employee insert error:",
        error
      );

      alert(
        "Unable to save employee. Please check the Supabase connection."
      );

      return;
    }

   const newEmployee = {
  id: data.employee_id,
  name: data.name,
  department: data.department,
  position: data.position,
  email: data.email,
  phone: data.phone,
  employmentType: data.employment_type,
  dateJoined: data.date_joined,
};

    setEmployees((current) => [
      ...current,
      newEmployee,
    ]);

    const {
      data: newPayrollData,
      error: payrollError,
    } = await supabase
      .from("payroll")
      .insert({
        employee_id: newEmployee.id,
        basic_salary: 0,
        allowances: 0,
        deductions: 0,
        status: "Pending",
        payroll_month: "September 2026",
      })
      .select("*")
      .single();

    if (payrollError) {
      console.error(
        "Supabase new employee payroll error:",
        payrollError
      );
    } else if (newPayrollData) {
      setPayroll((current) => [
        ...current,
        {
          id: newPayrollData.id,
          employeeId:
            newPayrollData.employee_id,
          basic:
            Number(
              newPayrollData.basic_salary
            ) || 0,
          allowance:
            Number(
              newPayrollData.allowances
            ) || 0,
          deduction:
            Number(
              newPayrollData.deductions
            ) || 0,
          status:
            newPayrollData.status,
        },
      ]);
    }

    setEmployeeForm({
  name: "",
  department: "",
  position: "",
  email: "",
  phone: "",
  employmentType: "Full-time",
  dateJoined: "",
});
    setShowEmployeeForm(false);
  };

  const startEmployeeEdit = (
    employee
  ) => {
    setEditingEmployeeId(employee.id);

    setEmployeeForm({
      name: employee.name,
      department:
        employee.department,
      position: employee.position,
      email: employee.email,
    });

    setShowEmployeeForm(true);
  };

  const handleEmployeeUpdate = async (
    event
  ) => {
    event.preventDefault();

    if (!editingEmployeeId) return;

        const {
      data,
      error,
    } = await supabase
      .from("employees")
      .update({
        name: employeeForm.name,
        department:
          employeeForm.department,
        position: employeeForm.position,
        email: employeeForm.email,
        phone: employeeForm.phone,
        employment_type:
          employeeForm.employmentType,
        date_joined:
          employeeForm.dateJoined,
      })
      .eq(
        "employee_id",
        editingEmployeeId
      )
      .select("*")
      .single();

    if (error) {
      console.error(
        "Employee update error:",
        error
      );

      alert(
        "Unable to update employee."
      );

      return;
    }

    setEmployees((current) =>
  current.map((employee) =>
    employee.id === editingEmployeeId
      ? {
          id: data.employee_id,
          name: data.name,
          department: data.department,
          position: data.position,
          email: data.email,
          phone: data.phone,
          employmentType:
            data.employment_type,
          dateJoined: data.date_joined,
        }
      : employee
  )
);

    setEmployeeForm({
      name: "",
      department: "",
      position: "",
      email: "",
    });

    setEditingEmployeeId(null);
    setShowEmployeeForm(false);

    if (
      selectedEmployee?.id ===
      editingEmployeeId
    ) {
      setSelectedEmployee({
        id: data.employee_id,
        name: data.name,
        department:
          data.department,
        position: data.position,
        email: data.email,
      });
    }
  };

  const handleEmployeeDelete = async (
    employee
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${employee.name}? This will also remove their related attendance, leave, payroll and performance records.`
      );

    if (!confirmed) return;

    const relatedTables = [
      "attendance",
      "leave_requests",
      "payroll",
      "performance_reviews",
    ];

    for (const table of relatedTables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq(
          "employee_id",
          employee.id
        );

      if (error) {
        console.error(
          `${table} delete error:`,
          error
        );
      }
    }

    const { error } = await supabase
      .from("employees")
      .delete()
      .eq(
        "employee_id",
        employee.id
      );

    if (error) {
      console.error(
        "Employee delete error:",
        error
      );

      alert(
        "Unable to delete employee."
      );

      return;
    }

    setEmployees((current) =>
      current.filter(
        (item) =>
          item.id !== employee.id
      )
    );

    setAttendance((current) =>
      current.filter(
        (item) =>
          item.employeeId !==
          employee.id
      )
    );

    setLeaveRequests((current) =>
      current.filter(
        (item) =>
          item.employeeId !==
          employee.id
      )
    );

    setPayroll((current) =>
      current.filter(
        (item) =>
          item.employeeId !==
          employee.id
      )
    );

    setPerformance((current) =>
      current.filter(
        (item) =>
          item.employeeId !==
          employee.id
      )
    );

    if (
      selectedEmployee?.id ===
      employee.id
    ) {
      setSelectedEmployee(null);
      setActivePage("Employees");
    }
  };

  const goToEmployeeProfile = (
    employee
  ) => {
    setSelectedEmployee(employee);
    setActivePage(
      "Employee Profile"
    );
  };

  const goToEmployees = () => {
    setSelectedEmployee(null);
    setActivePage("Employees");
  };

  /* =========================
     DASHBOARD
  ========================= */

  const renderDashboard = () => (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "flex-start",
          marginBottom: "25px",
          gap: "20px",
        }}
      >
        <div>
          <h2
  style={{
    margin: 0,
    fontSize: "26px",
    fontWeight: "800",
    color: "#111827",
    letterSpacing: "-0.5px",
  }}
>
  Welcome to ARISA HRIS
</h2>

          <p
  style={{
    color: "#64748b",
    marginTop: "7px",
    marginBottom: 0,
    fontSize: "13px",
    lineHeight: "1.5",
  }}
>
  Here's what's happening across your organization today.
</p>
        </div>
      </div>

      <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "18px",
    marginBottom: "24px",
  }}
>
        <DashboardCard
          title="Total Employees"
          value={employees.length}
          subtitle="Active employees"
          icon="♙"
        />

        <DashboardCard
          title="Present Today"
          value={presentCount}
         subtitle={`${lateCount} late · ${absentCount} absent`}
          icon="✓"
        />

        <DashboardCard
          title="Pending Leave"
          value={pendingLeave}
          subtitle={`${approvedLeave} approved`}
          icon="◷"
        />

        <DashboardCard
          title="Open Positions"
          value={openPositions}
          subtitle={`${hiredCount} hired`}
          icon="♧"
        />
      </div>

     <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "18px",
  }}
>
        <SectionCard title="Department Overview">
          {departmentStats.length === 0 ? (
            <p style={{ color: "#64748b" }}>
              No employee data available.
            </p>
          ) : (
            departmentStats.map(
              (item) => (
                <div
                  key={item.department}
                  style={{
                    marginBottom: "17px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      fontSize: "12px",
                      marginBottom: "7px",
                    }}
                  >
                    <span>
                      {item.department}
                    </span>

                    <strong>
                      {item.count}
                    </strong>
                  </div>

                  <div
                    style={{
                      height: "7px",
                      background:
                        "#e2e8f0",
                      borderRadius:
                        "10px",
                      overflow:
                        "hidden",
                    }}
                  >
                    <div
                      style={{
                       width: `${item.percentage}%`,
                        height: "100%",
                        background:
                          "#6366f1",
                        borderRadius:
                          "10px",
                      }}
                    />
                  </div>
                </div>
              )
            )
          )}
        </SectionCard>

        <SectionCard title="Performance Snapshot">
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, 1fr)",
              gap: "12px",
            }}
          >
            <MiniMetric
              label="Average Rating"
             value={`${averageRating}/5`}
            />

            <MiniMetric
              label="Completed Reviews"
              value={completedReviews}
            />

            <MiniMetric
              label="Pending Reviews"
              value={pendingReviews}
            />

            <MiniMetric
              label="Employees"
              value={employees.length}
            />
          </div>
        </SectionCard>

        <SectionCard title="Payroll Summary">
          <div
            style={{
              display: "grid",
              gap: "10px",
            }}
          >
            <MiniMetric
              label="Gross Payroll"
              value={formatCurrency(
                grossPayroll
              )}
            />

            <MiniMetric
              label="Allowances"
              value={formatCurrency(
                totalAllowances
              )}
            />

            <MiniMetric
              label="Deductions"
              value={formatCurrency(
                totalDeductions
              )}
            />

            <MiniMetric
              label="Net Payroll"
              value={formatCurrency(
                netPayroll
              )}
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );

  /* =========================
     EMPLOYEES
  ========================= */

  const renderEmployees = () => (
    <div>
      <PageTitle
        title="Employees"
        subtitle="Manage your organization's employee records."
      />

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "18px",
          gap: "15px",
        }}
      >
        <input
  value={searchTerm}
  onChange={(event) =>
    setSearchTerm(
      event.target.value
    )
  }
  placeholder="Search employees..."
  style={{
    flex: 1,
    maxWidth: "500px",
    padding: "11px 13px",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    fontSize: "13px",
    color: "#111827",
    background: "#ffffff",
    outline: "none",
  }}
/>

        <button
          onClick={() => {
            setEditingEmployeeId(
              null
            );

            setEmployeeForm({
              name: "",
              department: "",
              position: "",
              email: "",
            });

            setShowEmployeeForm(
              !showEmployeeForm
            );
          }}
          style={primaryButton}
        >
          + Add Employee
        </button>
      </div>

      {showEmployeeForm && (
        <SectionCard
          title={
            editingEmployeeId
              ? "Edit Employee"
              : "Add New Employee"
          }
        >
          <form
            onSubmit={
              editingEmployeeId
                ? handleEmployeeUpdate
                : handleEmployeeSubmit
            }
          >
            <div style={formGrid}>
              <FormInput
                label="Full Name"
                value={
                  employeeForm.name
                }
                onChange={(value) =>
                  setEmployeeForm(
                    (current) => ({
                      ...current,
                      name: value,
                    })
                  )
                }
                placeholder="Employee full name"
                required
              />

              <FormInput
                label="Department"
                value={
                  employeeForm.department
                }
                onChange={(value) =>
                  setEmployeeForm(
                    (current) => ({
                      ...current,
                      department:
                        value,
                    })
                  )
                }
                placeholder="e.g. Engineering"
                required
              />

              <FormInput
                label="Position"
                value={
                  employeeForm.position
                }
                onChange={(value) =>
                  setEmployeeForm(
                    (current) => ({
                      ...current,
                      position:
                        value,
                    })
                  )
                }
                placeholder="e.g. Software Engineer"
                required
              />

              <FormInput
                label="Email"
                type="email"
                value={
                  employeeForm.email
                }
                onChange={(value) =>
                  setEmployeeForm(
                    (current) => ({
                      ...current,
                      email: value,
                    })
                  )
                }
                placeholder="employee@arisa.com"
                required
              />

<FormInput
  label="Phone Number"
  value={employeeForm.phone}
  onChange={(value) =>
    setEmployeeForm((current) => ({
      ...current,
      phone: value,
    }))
  }
  placeholder="e.g. 08031234567"
/>

<FormSelect
  label="Employment Type"
  value={employeeForm.employmentType}
  onChange={(value) =>
    setEmployeeForm((current) => ({
      ...current,
      employmentType: value,
    }))
  }
  options={[
    { value: "Full-time", label: "Full-time" },
    { value: "Part-time", label: "Part-time" },
    { value: "Contract", label: "Contract" },
    { value: "Intern", label: "Intern" },
  ]}
/>

<FormInput
  label="Date Joined"
  type="date"
  value={employeeForm.dateJoined}
  onChange={(value) =>
    setEmployeeForm((current) => ({
      ...current,
      dateJoined: value,
    }))
  }
/>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                type="submit"
                style={primaryButton}
              >
                {editingEmployeeId
                  ? "Save Changes"
                  : "Save Employee"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowEmployeeForm(
                    false
                  );

                  setEditingEmployeeId(
                    null
                  );

                  setEmployeeForm({
                    name: "",
                    department: "",
                    position: "",
                    email: "",
                  });
                }}
                style={{
                  ...smallButton,
                  background: "white",
                  color: "#64748b",
                  borderColor:
                    "#cbd5e1",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </SectionCard>
      )}

      <div
        style={{
          marginTop: "24px",
        }}
      >
        <SectionCard>
          {employeesLoading ? (
            <p
              style={{
                color: "#64748b",
              }}
            >
              Loading employees...
            </p>
          ) : filteredEmployees.length ===
            0 ? (
            <p
              style={{
                color: "#64748b",
              }}
            >
              No employees found.
            </p>
          ) : (
            <div
              style={{
                overflowX: "auto",
              }}
            >
              <table
                style={tableStyle}
              >
                <thead>
                  <tr>
                    <th
                      style={thStyle}
                    >
                      ID
                    </th>

                    <th
                      style={thStyle}
                    >
                      Employee
                    </th>

                    <th
                      style={thStyle}
                    >
                      Department
                    </th>

                    <th
                      style={thStyle}
                    >
                      Position
                    </th>

                    <th
                      style={thStyle}
                    >
                      Email
                    </th>

                    <th
                      style={thStyle}
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.map(
                    (employee) => (
                      <tr
                        key={
                          employee.id
                        }
                      >
                        <td
                          style={
                            tdStyle
                          }
                        >
                          <strong>
                            {
                              employee.id
                            }
                          </strong>
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            employee.name
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            employee.department
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            employee.position
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            employee.email
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              gap: "6px",
                              flexWrap:
                                "wrap",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                goToEmployeeProfile(
                                  employee
                                )
                              }
                              style={
                                smallButton
                              }
                            >
                              View Profile
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                startEmployeeEdit(
                                  employee
                                )
                              }
                              style={
                                smallButton
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleEmployeeDelete(
                                  employee
                                )
                              }
                              style={
                                dangerButton
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );

  /* =========================
     ATTENDANCE
  ========================= */

  const renderAttendance = () => (
    <div>
      <PageTitle
        title="Attendance"
        subtitle="Track employee attendance for today."
      />

      {attendanceError && (
        <div
          style={{
            background: "#fef2f2",
            border:
              "1px solid #fecaca",
            color: "#dc2626",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "18px",
          }}
        >
          {attendanceError}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <DashboardCard
          title="Present"
          value={presentCount}
          subtitle={`${attendanceRate}% attendance rate`}
          icon="✓"
        />

        <DashboardCard
          title="Late"
          value={lateCount}
          subtitle="Arrived late"
          icon="◷"
        />

        <DashboardCard
          title="Absent"
          value={absentCount}
          subtitle="Not marked present"
          icon="!"
        />
      </div>

      <SectionCard title="Today's Attendance">
        {attendanceLoading ? (
          <p
            style={{
              color: "#64748b",
            }}
          >
            Loading attendance...
          </p>
        ) : employees.length === 0 ? (
          <p
            style={{
              color: "#64748b",
            }}
          >
            No employees available.
          </p>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={tableStyle}
            >
              <thead>
                <tr>
                  <th style={thStyle}>
                    Employee
                  </th>

                  <th style={thStyle}>
                    Department
                  </th>

                  <th style={thStyle}>
                    Status
                  </th>

                  <th style={thStyle}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {employees.map(
                  (employee) => {
                    const record =
                      attendance.find(
                        (item) =>
                          item.employeeId ===
                          employee.id
                      );

                    const status =
                      record?.status ||
                      "Absent";

                    return (
                      <tr
                        key={
                          employee.id
                        }
                      >
                        <td
                          style={
                            tdStyle
                          }
                        >
                          <strong>
                            {
                              employee.name
                            }
                          </strong>
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            employee.department
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          <StatusBadge
                            status={
                              status
                            }
                          />
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              gap: "6px",
                              flexWrap:
                                "wrap",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                updateAttendance(
                                  employee.id,
                                  "Present"
                                )
                              }
                              style={
                                smallButton
                              }
                            >
                              Present
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updateAttendance(
                                  employee.id,
                                  "Late"
                                )
                              }
                              style={
                                smallButton
                              }
                            >
                              Late
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updateAttendance(
                                  employee.id,
                                  "Absent"
                                )
                              }
                              style={
                                dangerButton
                              }
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );

  /* =========================
     LEAVE
  ========================= */

  const renderLeave = () => (
    <div>
      <PageTitle
        title="Leave Management"
        subtitle="Manage employee leave requests and approvals."
      />

      <SectionCard title="Request Leave">
        <form
          onSubmit={handleLeaveSubmit}
        >
          <div style={formGrid}>
            <FormSelect
              label="Employee"
              value={
                leaveForm.employeeId
              }
              onChange={(value) =>
                setLeaveForm(
                  (current) => ({
                    ...current,
                    employeeId:
                      value,
                  })
                )
              }
              options={[
                {
                  value: "",
                  label:
                    "Select employee",
                },
                ...employees.map(
                  (employee) => ({
                    value:
                      employee.id,
                    label:
                      employee.name,
                  })
                ),
              ]}
              required
            />

            <FormSelect
              label="Leave Type"
              value={leaveForm.type}
              onChange={(value) =>
                setLeaveForm(
                  (current) => ({
                    ...current,
                    type: value,
                  })
                )
              }
              options={[
                {
                  value:
                    "Annual Leave",
                  label:
                    "Annual Leave",
                },
                {
                  value:
                    "Sick Leave",
                  label:
                    "Sick Leave",
                },
                {
                  value:
                    "Maternity Leave",
                  label:
                    "Maternity Leave",
                },
                {
                  value:
                    "Emergency Leave",
                  label:
                    "Emergency Leave",
                },
              ]}
            />

            <FormInput
              label="Start Date"
              type="date"
              value={
                leaveForm.start
              }
              onChange={(value) =>
                setLeaveForm(
                  (current) => ({
                    ...current,
                    start: value,
                  })
                )
              }
              required
            />

            <FormInput
              label="End Date"
              type="date"
              value={
                leaveForm.end
              }
              onChange={(value) =>
                setLeaveForm(
                  (current) => ({
                    ...current,
                    end: value,
                  })
                )
              }
              required
            />

            <FormInput
              label="Reason"
              value={
                leaveForm.reason
              }
              onChange={(value) =>
                setLeaveForm(
                  (current) => ({
                    ...current,
                    reason: value,
                  })
                )
              }
              placeholder="Reason for leave"
            />
          </div>

          <button
            type="submit"
            style={primaryButton}
          >
            Submit Leave Request
          </button>
        </form>
      </SectionCard>

      <div
        style={{
          marginTop: "20px",
        }}
      >
        <SectionCard title="Leave Requests">
          {leaveLoading ? (
            <p
              style={{
                color: "#64748b",
              }}
            >
              Loading leave requests...
            </p>
          ) : leaveRequests.length ===
            0 ? (
            <p
              style={{
                color: "#64748b",
              }}
            >
              No leave requests yet.
            </p>
          ) : (
            <div
              style={{
                overflowX: "auto",
              }}
            >
              <table
                style={tableStyle}
              >
                <thead>
                  <tr>
                    <th style={thStyle}>
                      Employee
                    </th>

                    <th style={thStyle}>
                      Type
                    </th>

                    <th style={thStyle}>
                      Dates
                    </th>

                    <th style={thStyle}>
                      Reason
                    </th>

                    <th style={thStyle}>
                      Status
                    </th>

                    <th style={thStyle}>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {leaveRequests.map(
                    (item) => (
                      <tr
                        key={
                          item.id
                        }
                      >
                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            item.employee
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {item.type}
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {formatDate(
                            item.start
                          )}{" "}
                          —{" "}
                          {formatDate(
                            item.end
                          )}
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            item.reason ||
                            "—"
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          <StatusBadge
                            status={
                              item.status
                            }
                          />
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {item.status ===
                          "Pending" ? (
                            <div
                              style={{
                                display:
                                  "flex",
                                gap: "6px",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  updateLeaveStatus(
                                    item.id,
                                    "Approved"
                                  )
                                }
                                style={
                                  smallButton
                                }
                              >
                                Approve
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  updateLeaveStatus(
                                    item.id,
                                    "Rejected"
                                  )
                                }
                                style={
                                  dangerButton
                                }
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );

  /* =========================
     PAYROLL
  ========================= */

  const renderPayroll = () => (
    <div>
      <PageTitle
        title="Payroll"
        subtitle="Manage employee salaries, allowances and deductions."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <DashboardCard
          title="Gross Payroll"
          value={formatCurrency(
            grossPayroll
          )}
          subtitle="Basic salaries"
          icon="₦"
        />

        <DashboardCard
          title="Allowances"
          value={formatCurrency(
            totalAllowances
          )}
          subtitle="Total allowances"
          icon="+"
        />

        <DashboardCard
          title="Deductions"
          value={formatCurrency(
            totalDeductions
          )}
          subtitle="Total deductions"
          icon="-"
        />

        <DashboardCard
          title="Net Payroll"
          value={formatCurrency(
            netPayroll
          )}
          subtitle="Total payable"
          icon="✓"
        />
      </div>

      <SectionCard title="Payroll Records">
        {payrollLoading ? (
          <p
            style={{
              color: "#64748b",
            }}
          >
            Loading payroll...
          </p>
        ) : payroll.length === 0 ? (
          <p
            style={{
              color: "#64748b",
            }}
          >
            No payroll records found.
          </p>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={tableStyle}
            >
              <thead>
                <tr>
                  <th style={thStyle}>
                    Employee
                  </th>

                  <th style={thStyle}>
                    Basic
                  </th>

                  <th style={thStyle}>
                    Allowance
                  </th>

                  <th style={thStyle}>
                    Deduction
                  </th>

                  <th style={thStyle}>
                    Net Salary
                  </th>

                  <th style={thStyle}>
                    Status
                  </th>

                  <th style={thStyle}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {payroll.map(
                  (item) => {
                    const employee =
                      employees.find(
                        (employee) =>
                          employee.id ===
                          item.employeeId
                      );

                    const isEditing =
                      editingPayrollId ===
                      item.id;

                    return (
                      <tr
                        key={
                          item.id
                        }
                      >
                        <td
                          style={
                            tdStyle
                          }
                        >
                          <strong>
                            {employee?.name ||
                              item.employeeId}
                          </strong>
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {isEditing ? (
                            <input
                              type="number"
                              value={
                                payrollForm.basic
                              }
                              onChange={(
                                event
                              ) =>
                                setPayrollForm(
                                  (
                                    current
                                  ) => ({
                                    ...current,
                                    basic:
                                      event
                                        .target
                                        .value,
                                  })
                                )
                              }
                              style={
                                payrollInputStyle
                              }
                            />
                          ) : (
                            formatCurrency(
                              item.basic
                            )
                          )}
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {isEditing ? (
                            <input
                              type="number"
                              value={
                                payrollForm.allowance
                              }
                              onChange={(
                                event
                              ) =>
                                setPayrollForm(
                                  (
                                    current
                                  ) => ({
                                    ...current,
                                    allowance:
                                      event
                                        .target
                                        .value,
                                  })
                                )
                              }
                              style={
                                payrollInputStyle
                              }
                            />
                          ) : (
                            formatCurrency(
                              item.allowance
                            )
                          )}
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {isEditing ? (
                            <input
                              type="number"
                              value={
                                payrollForm.deduction
                              }
                              onChange={(
                                event
                              ) =>
                                setPayrollForm(
                                  (
                                    current
                                  ) => ({
                                    ...current,
                                    deduction:
                                      event
                                        .target
                                        .value,
                                  })
                                )
                              }
                              style={
                                payrollInputStyle
                              }
                            />
                          ) : (
                            formatCurrency(
                              item.deduction
                            )
                          )}
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {isEditing
                            ? formatCurrency(
                                getNetSalary(
                                  {
                                    basic:
                                      payrollForm.basic,
                                    allowance:
                                      payrollForm.allowance,
                                    deduction:
                                      payrollForm.deduction,
                                  }
                                )
                              )
                            : formatCurrency(
                                getNetSalary(
                                  item
                                )
                              )}
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          <StatusBadge
                            status={
                              item.status
                            }
                          />
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {isEditing ? (
                            <div
                              style={{
                                display:
                                  "flex",
                                gap: "6px",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  savePayroll(
                                    item
                                  )
                                }
                                style={
                                  smallButton
                                }
                              >
                                Save
                              </button>

                              <button
                                type="button"
                                onClick={
                                  cancelPayrollEdit
                                }
                                style={{
                                  ...smallButton,
                                  background:
                                    "white",
                                  color:
                                    "#64748b",
                                  borderColor:
                                    "#cbd5e1",
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div
                              style={{
                                display:
                                  "flex",
                                gap: "6px",
                                flexWrap:
                                  "wrap",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  startPayrollEdit(
                                    item
                                  )
                                }
                                style={
                                  smallButton
                                }
                              >
                                Edit
                              </button>

                              {item.status !==
                                "Processed" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    updatePayrollStatus(
                                      item.id,
                                      item.employeeId,
                                      "Processed"
                                    )
                                  }
                                  style={
                                    smallButton
                                  }
                                >
                                  Process
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );

  /* =========================
     PERFORMANCE
  ========================= */

  const renderPerformance = () => (
    <div>
      <PageTitle
        title="Performance"
        subtitle="Track employee reviews, ratings and goals."
      />

      <SectionCard title="Add Performance Review">
        <form
          onSubmit={
            handlePerformanceSubmit
          }
        >
          <div style={formGrid}>
            <FormSelect
              label="Employee"
              value={
                performanceForm.employeeId
              }
              onChange={(value) =>
                setPerformanceForm(
                  (current) => ({
                    ...current,
                    employeeId:
                      value,
                  })
                )
              }
              options={[
                {
                  value: "",
                  label:
                    "Select employee",
                },
                ...employees.map(
                  (employee) => ({
                    value:
                      employee.id,
                    label:
                      employee.name,
                  })
                ),
              ]}
              required
            />

            <FormInput
              label="Review Period"
              value={
                performanceForm.period
              }
              onChange={(value) =>
                setPerformanceForm(
                  (current) => ({
                    ...current,
                    period: value,
                  })
                )
              }
              placeholder="e.g. Q3 2026"
              required
            />

            <FormInput
              label="Rating"
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={
                performanceForm.rating
              }
              onChange={(value) =>
                setPerformanceForm(
                  (current) => ({
                    ...current,
                    rating: value,
                  })
                )
              }
              required
            />

            <FormInput
              label="Goal"
              value={
                performanceForm.goal
              }
              onChange={(value) =>
                setPerformanceForm(
                  (current) => ({
                    ...current,
                    goal: value,
                  })
                )
              }
              placeholder="Performance goal"
              required
            />
          </div>

          <button
            type="submit"
            style={primaryButton}
          >
            Add Review
          </button>
        </form>
      </SectionCard>

      <div
        style={{
          marginTop: "20px",
        }}
      >
        <SectionCard title="Performance Reviews">
          {performanceLoading ? (
            <p
              style={{
                color: "#64748b",
              }}
            >
              Loading performance reviews...
            </p>
          ) : performance.length ===
            0 ? (
            <p
              style={{
                color: "#64748b",
              }}
            >
              No performance reviews yet.
            </p>
          ) : (
            <div
              style={{
                overflowX: "auto",
              }}
            >
              <table
                style={tableStyle}
              >
                <thead>
                  <tr>
                    <th style={thStyle}>
                      Employee
                    </th>

                    <th style={thStyle}>
                      Period
                    </th>

                    <th style={thStyle}>
                      Rating
                    </th>

                    <th style={thStyle}>
                      Goal
                    </th>

                    <th style={thStyle}>
                      Status
                    </th>

                    <th style={thStyle}>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {performance.map(
                    (review) => (
                      <tr
                        key={
                          review.id
                        }
                      >
                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            review.employee
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            review.period
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          ⭐{" "}
                          {
                            review.rating
                          }
                          /5
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {
                            review.goal
                          }
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          <StatusBadge
                            status={
                              review.status
                            }
                          />
                        </td>

                        <td
                          style={
                            tdStyle
                          }
                        >
                          {review.status ===
                            "Pending" && (
                            <button
                              type="button"
                              onClick={() =>
                                updatePerformanceStatus(
                                  review.id,
                                  "Completed"
                                )
                              }
                              style={
                                smallButton
                              }
                            >
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );

  /* =========================
     RECRUITMENT
  ========================= */

  const renderRecruitment = () => (
    <div>
      <PageTitle
        title="Recruitment"
        subtitle="Manage open roles and applicant pipelines."
      />

      <SectionCard title="Add Applicant">
        <form
          onSubmit={
            handleApplicantSubmit
          }
        >
          <div style={formGrid}>
            <FormInput
              label="Applicant Name"
              value={
                applicantForm.name
              }
              onChange={(value) =>
                setApplicantForm(
                  (current) => ({
                    ...current,
                    name: value,
                  })
                )
              }
              placeholder="Applicant full name"
              required
            />

            <FormSelect
              label="Job"
              value={
                applicantForm.jobId
              }
              onChange={(value) =>
                setApplicantForm(
                  (current) => ({
                    ...current,
                    jobId: value,
                  })
                )
              }
              options={[
                {
                  value: "",
                  label:
                    "Select job",
                },
                ...jobs
                  .filter(
                    (job) =>
                      job.status ===
                      "Open"
                  )
                  .map((job) => ({
                    value:
                      job.id,
                    label:
                      `${job.title} — ${job.department}`,
                  })),
              ]}
              required
            />

            <FormInput
              label="Application Date"
              type="date"
              value={
                applicantForm.applicationDate
              }
              onChange={(value) =>
                setApplicantForm(
                  (current) => ({
                    ...current,
                    applicationDate:
                      value,
                  })
                )
              }
              required
            />
          </div>

          <button
            type="submit"
            style={primaryButton}
          >
            Add Applicant
          </button>
        </form>
      </SectionCard>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        {jobs
          .filter(
            (job) =>
              job.status === "Open"
          )
          .map((job) => (
            <SectionCard
              key={job.id}
              title={job.title}
            >
              <div
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                {job.department}
              </div>

              <div
                style={{
                  marginTop: "12px",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
              >
                {job.applicants}
              </div>

              <div
                style={{
                  color: "#64748b",
                  fontSize: "12px",
                }}
              >
                Applicants
              </div>
            </SectionCard>
          ))}
      </div>

      <SectionCard title="Recruitment Pipeline">
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {recruitmentPipeline.map(
            (item) => (
              <MiniMetric
                key={item.status}
                label={item.status}
                value={item.count}
              />
            )
          )}
        </div>

        {recruitmentLoading ? (
          <p
            style={{
              color: "#64748b",
            }}
          >
            Loading applicants...
          </p>
        ) : applicants.length ===
          0 ? (
          <p
            style={{
              color: "#64748b",
            }}
          >
            No applicants yet.
          </p>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={tableStyle}
            >
              <thead>
                <tr>
                  <th style={thStyle}>
                    Applicant
                  </th>

                  <th style={thStyle}>
                    Position
                  </th>

                  <th style={thStyle}>
                    Department
                  </th>

                  <th style={thStyle}>
                    Applied
                  </th>

                  <th style={thStyle}>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {applicants.map(
                  (applicant) => (
                    <tr
                      key={
                        applicant.id
                      }
                    >
                      <td
                        style={
                          tdStyle
                        }
                      >
                        {
                          applicant.name
                        }
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        {
                          applicant.position
                        }
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        {
                          applicant.department
                        }
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        {formatDate(
                          applicant.applicationDate
                        )}
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        <select
                          value={
                            applicant.status
                          }
                          onChange={(
                            event
                          ) =>
                            updateApplicantStatus(
                              applicant.id,
                              event
                                .target
                                .value
                            )
                          }
                          style={
                            selectStyle
                          }
                        >
                          <option>
                            Applied
                          </option>
                          <option>
                            Screening
                          </option>
                          <option>
                            Interview
                          </option>
                          <option>
                            Offer
                          </option>
                          <option>
                            Hired
                          </option>
                        </select>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );

  /* =========================
     ANALYTICS
  ========================= */

  const renderAnalytics = () => (
    <div>
      <PageTitle
        title="Analytics"
        subtitle="View key workforce and HR performance indicators."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <DashboardCard
          title="Employees"
          value={employees.length}
          subtitle="Total employees"
          icon="♙"
        />

        <DashboardCard
          title="Attendance"
          value={`${attendanceRate}%`}
          subtitle="Present today"
          icon="✓"
        />

        <DashboardCard
          title="Average Rating"
          value={`${averageRating}/5`}
          subtitle="Performance reviews"
          icon="★"
        />

        <DashboardCard
          title="Net Payroll"
          value={formatCurrency(
            netPayroll
          )}
          subtitle="Current payroll"
          icon="₦"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        <SectionCard title="Employees by Department">
          {departmentStats.length ===
          0 ? (
            <p
              style={{
                color: "#64748b",
              }}
            >
              No employee data.
            </p>
          ) : (
            departmentStats.map(
              (item) => (
                <div
                  key={
                    item.department
                  }
                  style={{
                    marginBottom:
                      "18px",
                  }}
                >
                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      marginBottom:
                        "7px",
                      fontSize:
                        "13px",
                    }}
                  >
                    <span>
                      {
                        item.department
                      }
                    </span>

                    <strong>
                      {item.count} (
                      {
                        item.percentage
                      }
                      %)
                    </strong>
                  </div>

                  <div
                    style={{
                      height: "9px",
                      background:
                        "#e2e8f0",
                      borderRadius:
                        "10px",
                      overflow:
                        "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${item.percentage}%`,
                        height: "100%",
                        background:
                          "#6366f1",
                        borderRadius:
                          "10px",
                      }}
                    />
                  </div>
                </div>
              )
            )
          )}
        </SectionCard>

        <SectionCard title="Recruitment Pipeline">
          {recruitmentPipeline.map(
            (item) => (
              <div
                key={item.status}
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  padding:
                    "12px 0",
                  borderBottom:
                    "1px solid #f1f5f9",
                }}
              >
                <span>
                  {item.status}
                </span>

                <strong>
                  {item.count}
                </strong>
              </div>
            )
          )}
        </SectionCard>
      </div>
    </div>
  );

  /* =========================
     EMPLOYEE PROFILE
  ========================= */

  const renderEmployeeProfile = () => {
    if (!selectedEmployee) {
      return renderEmployees();
    }

    const employeePayroll =
      payroll.find(
        (item) =>
          item.employeeId ===
          selectedEmployee.id
      );

    const employeeAttendance =
      attendance.find(
        (item) =>
          item.employeeId ===
          selectedEmployee.id
      );

    const employeeReviews =
      performance.filter(
        (item) =>
          item.employeeId ===
          selectedEmployee.id
      );

    const employeeLeave =
      leaveRequests.filter(
        (item) =>
          item.employeeId ===
          selectedEmployee.id
      );

    return (
      <div>
        <button
          onClick={goToEmployees}
          style={backButton}
        >
          ← Back to Employees
        </button>

        <div
          style={{
            marginTop: "18px",
            background:
              "linear-gradient(135deg, #4f46e5, #6366f1)",
            borderRadius: "16px",
            padding: "28px",
            color: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background:
                  "rgba(255,255,255,0.18)",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                fontSize: "25px",
                fontWeight: "800",
              }}
            >
              {selectedEmployee.name
                .split(" ")
                .map(
                  (word) =>
                    word[0]
                )
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                }}
              >
                {
                  selectedEmployee.name
                }
              </h2>

              <p
                style={{
                  margin:
                    "5px 0 0",
                  opacity: 0.9,
                }}
              >
                {
                  selectedEmployee.position
                }{" "}
                ·{" "}
                {
                  selectedEmployee.department
                }
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
            marginTop: "20px",
          }}
        >
          <SectionCard title="Employee Information">
  <ProfileInfo
    label="Employee ID"
    value={selectedEmployee.id}
  />

  <ProfileInfo
    label="Email"
    value={selectedEmployee.email}
  />

  <ProfileInfo
    label="Phone Number"
    value={
      selectedEmployee.phone ||
      "Not provided"
    }
  />

  <ProfileInfo
    label="Department"
    value={selectedEmployee.department}
  />

  <ProfileInfo
    label="Position"
    value={selectedEmployee.position}
  />

  <ProfileInfo
    label="Employment Type"
    value={
      selectedEmployee.employmentType ||
      "Not provided"
    }
  />

  <ProfileInfo
    label="Date Joined"
    value={
      selectedEmployee.dateJoined
        ? new Date(
            selectedEmployee.dateJoined
          ).toLocaleDateString(
            "en-NG",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          )
        : "Not provided"
    }
  />
</SectionCard>

          <SectionCard title="HR Summary">
            <ProfileInfo
              label="Attendance"
              value={
                employeeAttendance?.status ||
                "Not marked"
              }
            />

            <ProfileInfo
              label="Net Salary"
              value={
                employeePayroll
                  ? formatCurrency(
                      getNetSalary(
                        employeePayroll
                      )
                    )
                  : "₦0"
              }
            />

            <ProfileInfo
              label="Leave Requests"
              value={
                employeeLeave.length
              }
            />

            <ProfileInfo
              label="Performance Reviews"
              value={
                employeeReviews.length
              }
            />
          </SectionCard>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <SectionCard title="Leave History">
            {employeeLeave.length ===
            0 ? (
              <p
                style={{
                  color:
                    "#64748b",
                }}
              >
                No leave records.
              </p>
            ) : (
              employeeLeave.map(
                (item) => (
                  <div
                    key={
                      item.id
                    }
                    style={{
                      padding:
                        "12px 0",
                      borderBottom:
                        "1px solid #e2e8f0",
                    }}
                  >
                    <strong>
                      {
                        item.type
                      }
                    </strong>

                    <div
                      style={{
                        fontSize:
                          "12px",
                        color:
                          "#64748b",
                        marginTop:
                          "4px",
                      }}
                    >
                      {formatDate(
                        item.start
                      )}{" "}
                      —{" "}
                      {formatDate(
                        item.end
                      )}
                    </div>

                    <div
                      style={{
                        marginTop:
                          "5px",
                      }}
                    >
                      <StatusBadge
                        status={
                          item.status
                        }
                      />
                    </div>
                  </div>
                )
              )
            )}
          </SectionCard>

          <SectionCard title="Performance">
            {employeeReviews.length ===
            0 ? (
              <p
                style={{
                  color:
                    "#64748b",
                }}
              >
                No performance
                records.
              </p>
            ) : (
              employeeReviews.map(
                (item) => (
                  <div
                    key={
                      item.id
                    }
                    style={{
                      padding:
                        "12px 0",
                      borderBottom:
                        "1px solid #e2e8f0",
                    }}
                  >
                    <strong>
                      {
                        item.period
                      }
                    </strong>

                    <div
                      style={{
                        marginTop:
                          "5px",
                      }}
                    >
                      ⭐{" "}
                      {
                        item.rating
                      }
                      /5
                    </div>

                    <div
                      style={{
                        fontSize:
                          "12px",
                        color:
                          "#64748b",
                        marginTop:
                          "5px",
                      }}
                    >
                      {
                        item.goal
                      }
                    </div>

                    <div
                      style={{
                        marginTop:
                          "6px",
                      }}
                    >
                      <StatusBadge
                        status={
                          item.status
                        }
                      />
                    </div>
                  </div>
                )
              )
            )}
          </SectionCard>
        </div>
      </div>
    );
  };

  /* =========================
     SETTINGS
  ========================= */

  const renderSettings = () => (
    <div>
      <PageTitle
        title="Admin Settings"
        subtitle="Manage your ARISA administrator login credentials."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        <SectionCard title="Login Credentials">
          <div
            style={{
              background:
                "#f8fafc",
              border:
                "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "14px",
              marginBottom:
                "20px",
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            Change the email and
            password used to sign
            into ARISA.
          </div>

          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            <FormInput
              label="Admin Email"
              type="email"
              value={
                settingsForm.email
              }
              onChange={(value) =>
                setSettingsForm(
                  (current) => ({
                    ...current,
                    email: value,
                  })
                )
              }
              placeholder="admin@arisa.com"
              required
            />

            <FormInput
              label="New Password"
              type="password"
              value={
                settingsForm.password
              }
              onChange={(value) =>
                setSettingsForm(
                  (current) => ({
                    ...current,
                    password:
                      value,
                  })
                )
              }
              placeholder="Enter new password"
              required
            />

            <FormInput
              label="Confirm New Password"
              type="password"
              value={
                settingsForm.confirmPassword
              }
              onChange={(value) =>
                setSettingsForm(
                  (current) => ({
                    ...current,
                    confirmPassword:
                      value,
                  })
                )
              }
              placeholder="Confirm new password"
              required
            />
          </div>

          {settingsError && (
            <div
              style={{
                background:
                  "#fef2f2",
                color:
                  "#dc2626",
                border:
                  "1px solid #fecaca",
                padding: "11px",
                borderRadius:
                  "8px",
                fontSize:
                  "13px",
                marginTop:
                  "16px",
              }}
            >
              {settingsError}
            </div>
          )}

          {settingsMessage && (
            <div
              style={{
                background:
                  "#f0fdf4",
                color:
                  "#16a34a",
                border:
                  "1px solid #bbf7d0",
                padding: "11px",
                borderRadius:
                  "8px",
                fontSize:
                  "13px",
                marginTop:
                  "16px",
              }}
            >
              {settingsMessage}
            </div>
          )}

          <button
            type="button"
            onClick={
              saveAdminCredentials
            }
            style={{
              ...primaryButton,
              marginTop: "18px",
            }}
          >
            Save Credentials
          </button>
        </SectionCard>

        <SectionCard title="Current Admin Account">
          <ProfileInfo
            label="Admin Email"
            value={
              adminCredentials.email
            }
          />

          <ProfileInfo
            label="Password"
            value="••••••••"
          />

          <div
            style={{
              marginTop:
                "20px",
              padding:
                "14px",
              background:
                "#eef2ff",
              borderRadius:
                "10px",
              color:
                "#4338ca",
              fontSize:
                "13px",
              lineHeight:
                "1.6",
            }}
          >
            <strong>
              Security note
            </strong>

            <div>
              These demo credentials
              are stored locally in
              this browser. For a
              production HRIS, admin
              authentication should
              be moved to Supabase
              Auth or another secure
              authentication system.
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );

  /* =========================
     PAGE ROUTING
  ========================= */

  let pageContent;

  if (
    activePage ===
    "Dashboard"
  ) {
    pageContent =
      renderDashboard();
  } else if (
    activePage ===
    "Employees"
  ) {
    pageContent =
      renderEmployees();
  } else if (
    activePage ===
    "Attendance"
  ) {
    pageContent =
      renderAttendance();
  } else if (
    activePage === "Leave"
  ) {
    pageContent =
      renderLeave();
  } else if (
    activePage ===
    "Payroll"
  ) {
    pageContent =
      renderPayroll();
  } else if (
    activePage ===
    "Performance"
  ) {
    pageContent =
      renderPerformance();
  } else if (
    activePage ===
    "Recruitment"
  ) {
    pageContent =
      renderRecruitment();
  } else if (
    activePage ===
    "Analytics"
  ) {
    pageContent =
      renderAnalytics();
  } else if (
    activePage ===
    "Employee Profile"
  ) {
    pageContent =
      renderEmployeeProfile();
  } else if (
    activePage ===
    "Admin Settings"
  ) {
    pageContent =
      renderSettings();
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        color: "#0f172a",
      }}
    >
      {/* SIDEBAR */}

      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: sidebarOpen
            ? "245px"
            : "76px",
          background: "#111827",
          color: "white",
          transition:
            "width 0.2s ease",
          zIndex: 20,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "72px",
            display: "flex",
            alignItems:
              "center",
            gap: "12px",
            padding:
              "0 18px",
            borderBottom:
              "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              minWidth: "40px",
              width: "40px",
              height: "40px",
              borderRadius:
                "11px",
              background:
                "#4f46e5",
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              fontWeight:
                "800",
            }}
          >
            AR
          </div>

          {sidebarOpen && (
            <div>
              <div
                style={{
                  fontWeight:
                    "800",
                  fontSize:
                    "17px",
                }}
              >
                ARISA
              </div>

              <div
                style={{
                  fontSize:
                    "10px",
                  color:
                    "#94a3b8",
                  marginTop:
                    "2px",
                }}
              >
                HRIS
              </div>
            </div>
          )}
        </div>

        <nav
          style={{
            padding:
              "18px 10px",
          }}
        >
          {navItems.map(
            (item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(
                    item.id
                  );
                  setSelectedEmployee(
                    null
                  );
                  setProfileOpen(
                    false
                  );
                }}
                style={{
                  width: "100%",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: "13px",
                  padding:
                    "11px 12px",
                  marginBottom:
                    "5px",
                  border: "none",
                  borderRadius:
                    "8px",
                  background:
                    activePage ===
                    item.id
                      ? "#4f46e5"
                      : "transparent",
                  color:
                    activePage ===
                    item.id
                      ? "white"
                      : "#cbd5e1",
                  cursor:
                    "pointer",
                  textAlign:
                    "left",
                  fontSize:
                    "13px",
                }}
              >
                <span
                  style={{
                    width:
                      "24px",
                    textAlign:
                      "center",
                    fontSize:
                      "17px",
                  }}
                >
                  {item.icon}
                </span>

                {sidebarOpen && (
                  <span>
                    {item.id}
                  </span>
                )}
              </button>
            )
          )}

          <button
            onClick={() => {
              setActivePage(
                "Admin Settings"
              );
              setSelectedEmployee(
                null
              );
              setProfileOpen(
                false
              );
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems:
                "center",
              gap: "13px",
              padding:
                "11px 12px",
              marginTop:
                "15px",
              border: "none",
              borderRadius:
                "8px",
              background:
                activePage ===
                "Admin Settings"
                  ? "#4f46e5"
                  : "transparent",
              color:
                activePage ===
                "Admin Settings"
                  ? "white"
                  : "#cbd5e1",
              cursor:
                "pointer",
              textAlign:
                "left",
              fontSize:
                "13px",
            }}
          >
            <span
              style={{
                width: "24px",
                textAlign:
                  "center",
                fontSize:
                  "17px",
              }}
            >
              ⚙
            </span>

            {sidebarOpen && (
              <span>
                Settings
              </span>
            )}
          </button>
        </nav>

        {sidebarOpen && (
          <div
            style={{
              position:
                "absolute",
              bottom: "18px",
              left: "15px",
              right: "15px",
              background:
                "#1e293b",
              borderRadius:
                "10px",
              padding:
                "12px",
              fontSize:
                "11px",
              color:
                "#94a3b8",
            }}
          >
            <div
              style={{
                color:
                  "#86efac",
                marginBottom:
                  "4px",
              }}
            >
              ● System Operational
            </div>

            ARISA HRIS
          </div>
        )}
      </aside>

      {/* MAIN */}

      <main
        style={{
          marginLeft:
            sidebarOpen
              ? "245px"
              : "76px",
          minHeight:
            "100vh",
          transition:
            "margin-left 0.2s ease",
        }}
      >
        {/* HEADER */}

        <header
          style={{
            height: "72px",
            background: "white",
            borderBottom:
              "1px solid #e2e8f0",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "space-between",
            padding:
              "0 25px",
            position:
              "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: "15px",
            }}
          >
            <button
              onClick={() =>
                setSidebarOpen(
                  !sidebarOpen
                )
              }
              style={{
                border: "none",
                background:
                  "#f1f5f9",
                width: "38px",
                height: "38px",
                borderRadius:
                  "8px",
                cursor:
                  "pointer",
                fontSize:
                  "17px",
              }}
            >
              ☰
            </button>

            <div>
              <div
                style={{
                  fontWeight:
                    "700",
                  fontSize:
                    "14px",
                }}
              >
                {activePage}
              </div>

              <div
                style={{
                  fontSize:
                    "11px",
                  color:
                    "#94a3b8",
                  marginTop:
                    "2px",
                }}
              >
                {currentDate}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                position:
                  "relative",
              }}
            >
              <button
                onClick={() =>
                  setNotificationsOpen(
                    !notificationsOpen
                  )
                }
                style={{
                  width: "38px",
                  height: "38px",
                  border:
                    "1px solid #e2e8f0",
                  background:
                    "white",
                  borderRadius:
                    "8px",
                  cursor:
                    "pointer",
                  fontSize:
                    "17px",
                }}
              >
                🔔
              </button>

              {notificationsOpen && (
                <div
                  style={{
                    position:
                      "absolute",
                    right: 0,
                    top:
                      "48px",
                    width:
                      "280px",
                    background:
                      "white",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius:
                      "12px",
                    padding:
                      "15px",
                    boxShadow:
                      "0 15px 35px rgba(15,23,42,0.12)",
                    zIndex:
                      50,
                  }}
                >
                  <strong>
                    Notifications
                  </strong>

                  <div
                    style={{
                      marginTop:
                        "12px",
                      fontSize:
                        "13px",
                      color:
                        "#64748b",
                    }}
                  >
                    {pendingLeave >
                    0
                      ? `${pendingLeave} leave request(s) pending approval.`
                      : "No pending notifications."}
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                position:
                  "relative",
              }}
            >
              <button
                onClick={() =>
                  setProfileOpen(
                    !profileOpen
                  )
                }
                style={{
                  border:
                    "none",
                  background:
                    "transparent",
                  cursor:
                    "pointer",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width:
                      "38px",
                    height:
                      "38px",
                    borderRadius:
                      "50%",
                    background:
                      "#e0e7ff",
                    color:
                      "#4338ca",
                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    fontWeight:
                      "800",
                  }}
                >
                  EA
                </div>

                <div
                  style={{
                    textAlign:
                      "left",
                  }}
                >
                  <div
                    style={{
                      fontWeight:
                        "700",
                      fontSize:
                        "12px",
                    }}
                  >
                    Esther Admin
                  </div>

                  <div
                    style={{
                      fontSize:
                        "10px",
                      color:
                        "#94a3b8",
                    }}
                  >
                    HR Administrator
                  </div>
                </div>
              </button>

              {profileOpen && (
                <div
                  style={{
                    position:
                      "absolute",
                    right: 0,
                    top:
                      "50px",
                    width:
                      "190px",
                    background:
                      "white",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius:
                      "10px",
                    padding:
                      "8px",
                    boxShadow:
                      "0 15px 35px rgba(15,23,42,0.12)",
                    zIndex:
                      50,
                  }}
                >
                  <button
                    onClick={() => {
                      setActivePage(
                        "Admin Settings"
                      );
                      setProfileOpen(
                        false
                      );
                    }}
                    style={{
                      width:
                        "100%",
                      padding:
                        "10px",
                      border:
                        "none",
                      background:
                        "transparent",
                      textAlign:
                        "left",
                      cursor:
                        "pointer",
                      borderRadius:
                        "7px",
                    }}
                  >
                    ⚙ Settings
                  </button>

                  <button
                    onClick={
                      handleLogout
                    }
                    style={{
                      width:
                        "100%",
                      padding:
                        "10px",
                      border:
                        "none",
                      background:
                        "transparent",
                      color:
                        "#dc2626",
                      textAlign:
                        "left",
                      cursor:
                        "pointer",
                      borderRadius:
                        "7px",
                    }}
                  >
                    ↪ Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <div
          style={{
            padding:
              "25px",
            maxWidth:
              "1500px",
            margin:
              "0 auto",
          }}
        >
          <div
            style={{
              fontSize:
                "11px",
              color:
                "#94a3b8",
              marginBottom:
                "18px",
            }}
          >
            ARISA HRIS /{" "}
            <span
              style={{
                color:
                  "#475569",
              }}
            >
              {activePage}
            </span>
          </div>

          {pageContent}
        </div>

        {/* FOOTER */}

        <footer
          style={{
            padding:
              "20px 25px",
            borderTop:
              "1px solid #e2e8f0",
            background:
              "white",
            color:
              "#94a3b8",
            fontSize:
              "11px",
            textAlign:
              "center",
          }}
        >
          ARISA HRIS · Version 1.0 ·
          Human Resource Management
          System
        </footer>
      </main>
    </div>
  );
}

/* =========================
   REUSABLE COMPONENTS
========================= */

function DashboardCard({
  title,
  value,
  subtitle,
  icon,
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "20px",
        boxShadow:
          "0 2px 8px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "15px",
        }}
      >
        <div>
          <div
            style={{
              color: "#64748b",
              fontSize: "12px",
              fontWeight: "600",
              marginBottom: "8px",
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: "27px",
              fontWeight: "800",
              color: "#111827",
              letterSpacing: "-0.5px",
            }}
          >
            {value}
          </div>

          <div
            style={{
              color: "#94a3b8",
              fontSize: "11px",
              marginTop: "6px",
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "11px",
            background: "#eef2ff",
            color: "#4f46e5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            fontWeight: "700",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "22px",
        boxShadow:
          "0 2px 8px rgba(15, 23, 42, 0.035)",
      }}
    >
      {title && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "15px",
              fontWeight: "800",
              color: "#1e293b",
            }}
          >
            {title}
          </h3>
        </div>
      )}

      {children}
    </div>
  );
}

function MiniMetric({
  label,
  value,
}) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "14px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          color: "#64748b",
          fontWeight: "600",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontWeight: "800",
          fontSize: "19px",
          color: "#111827",
          marginTop: "6px",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function PageTitle({
  title,
  subtitle,
}) {
  return (
    <div
      style={{
        marginBottom: "24px",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "24px",
          fontWeight: "800",
          color: "#111827",
          letterSpacing: "-0.4px",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          color: "#64748b",
          margin: "7px 0 0",
          fontSize: "13px",
          lineHeight: "1.5",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}

function FormInput({
  label,
  type = "text",
  value = "",
  onChange,
  placeholder,
  required = false,
  min,
  max,
  step,
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontWeight: "700",
          fontSize: "12px",
          marginBottom: "7px",
          color: "#374151",
        }}
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        style={{
          width: "100%",
          padding: "11px 12px",
          border: "1px solid #d1d5db",
          borderRadius: "9px",
          fontSize: "13px",
          color: "#111827",
          background: "#ffffff",
          outline: "none",
        }}
      />
    </div>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options,
  required = false,
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontWeight: "700",
          fontSize: "12px",
          marginBottom: "7px",
          color: "#374151",
        }}
      >
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        required={required}
        style={{
          width: "100%",
          padding: "11px 12px",
          border: "1px solid #d1d5db",
          borderRadius: "9px",
          fontSize: "13px",
          background: "#ffffff",
          color: "#111827",
          outline: "none",
        }}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ProfileInfo({
  label,
  value,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        padding: "12px 0",
        borderBottom: "1px solid #f1f5f9",
        fontSize: "13px",
      }}
    >
      <span
        style={{
          color: "#64748b",
          fontWeight: "500",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          textAlign: "right",
          color: "#1e293b",
          fontWeight: "700",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function StatusBadge({ status }) {
  const isGreen =
    status === "Approved" ||
    status === "Completed" ||
    status === "Processed" ||
    status === "Present" ||
    status === "Hired";

  const isRed =
    status === "Rejected" ||
    status === "Absent";

  const isYellow =
    status === "Late" ||
    status === "Pending";

  const background = isGreen
    ? "#dcfce7"
    : isRed
    ? "#fee2e2"
    : isYellow
    ? "#fef3c7"
    : "#e0e7ff";

  const color = isGreen
    ? "#166534"
    : isRed
    ? "#991b1b"
    : isYellow
    ? "#92400e"
    : "#3730a3";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 10px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: "700",
        background,
        color,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

/* =========================
   STYLES
========================= */

const primaryButton = {
  background: "#4f46e5",
  color: "#ffffff",
  border: "none",
  padding: "10px 16px",
  borderRadius: "9px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "12px",
  transition: "all 0.2s ease",
};

const smallButton = {
  background: "#eef2ff",
  color: "#4338ca",
  border: "1px solid #c7d2fe",
  padding: "7px 11px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "11px",
};

const dangerButton = {
  background: "#fef2f2",
  color: "#dc2626",
  border: "1px solid #fecaca",
  padding: "7px 11px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "11px",
};

const payrollInputStyle = {
  width: "100px",
  padding: "7px 8px",
  border: "1px solid #d1d5db",
  borderRadius: "7px",
  fontSize: "12px",
  outline: "none",
};

const backButton = {
  background: "#ffffff",
  color: "#475569",
  border: "1px solid #d1d5db",
  padding: "9px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "12px",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
  marginBottom: "18px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "12px",
};

const thStyle = {
  textAlign: "left",
  padding: "13px 10px",
  background: "#f8fafc",
  color: "#64748b",
  fontWeight: "700",
  borderBottom: "1px solid #e2e8f0",
  whiteSpace: "nowrap",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.3px",
};

const tdStyle = {
  padding: "13px 10px",
  borderBottom: "1px solid #f1f5f9",
  verticalAlign: "middle",
  color: "#334155",
};

const selectStyle = {
  width: "100%",
  padding: "10px 11px",
  border: "1px solid #d1d5db",
  borderRadius: "9px",
  fontSize: "13px",
  background: "#ffffff",
  color: "#111827",
  outline: "none",
};

export default App;