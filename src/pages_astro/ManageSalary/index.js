import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import SubNavbar from '../../layout/SubNavbar';
import { EditDailyWork, DailyTaskList } from '../../utils/api.services';
import { ExportToCSV, ExportToExcel, ExportToPdf, SWIT_DELETE, SWIT_DELETE_SUCCESS, TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import profile_image from '../../assets/Images/default.jpg'
import ReactDatatable from '../../config/ReactDatatable';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getDailyTaskListThunk, getSalaryListThunk, setLoader, updateDailyTaskList } from '../../Store/slices/MasterSlice';
import Constatnt, { Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, formatDate, formatDateDyjs, getAllStatusObject, getLoanStatusObject, openModel } from '../../config/commonFunction';
import Model from '../../component/Model';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import Pagination from '../../component/Pagination';
import { DateFormat, EMPLOYEE_STATUS, STATUS_COLORS } from '../../config/commonVariable';
import { IoAddCircleOutline } from 'react-icons/io5';
import { DatePicker, Row } from 'antd';
import dayjs from 'dayjs';
import {
    BsCalendar,
    BsCheckCircle,
    BsCircleHalf,
    BsXCircle,
    BsGift,
    BsPersonDash,
    BsCalendarCheck,
    BsCashCoin,
    BsCurrencyRupee,
    BsArrowRepeat,
    BsCalendarMinus,
    BsCalendarWeek,
    BsDashCircle,
} from "react-icons/bs"


export default function ManageSalary() {

    let navigat = useNavigate();
    const dispatch = useDispatch();
    const dateFormat = "MMM-YYYY";
    const [startDate, setStartDate] = useState(dayjs().subtract(1, "month"));

    const [totalRows, setTotalRows] = useState(0);
    const [checked, setChecked] = useState('');
    const [is_load, setis_load] = useState(false);

    const { salaryList: { data: salaryList }, } = useSelector((state) => state.masterslice);
    const { customModel } = useSelector((state) => state.masterslice);

    const [selectedUser, setSelectedUser] = useState()

    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const debounce = useDebounce(globalFilterValue, SEARCH_DELAY);
    const [filters, setFilters] = useState({ global: { value: '' } });
    const [sortField, setSortField] = useState('created_at');
    const [sortOrder, setSortOrder] = useState(-1);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [employeeStatus, setEmployeeStatus] = useState(EMPLOYEE_STATUS[0]);

    const hasInitialLoaded = useRef(false);

    const fetchData = async () => {
        const request = {
            "month": startDate ? formatDateDyjs(startDate, 'MM') : null,
            "year": startDate ? formatDateDyjs(startDate, 'YYYY') : null,

        }
        await dispatch(getSalaryListThunk(request));
    };

    useEffect(() => {
        if (salaryList?.length === 0) {
            fetchData();
        }
    }, []);

    const handleStatus = async (id, changeChecked) => {
        setis_load(true)

        let submitData = {
            user_id: id,
            is_active: changeChecked == '1' ? true : false,
        }
        EditDailyWork(submitData).then((response) => {
            if (response.status_code === Codes.SUCCESS) {
                TOAST_SUCCESS(response?.message)
                setis_load(false)
                fetchData()
                // let updatedList = customerList?.user?.map((item) => {
                //     console.log('customerListuser',item);

                //     if (id == item.id) {
                //         return {
                //             ...item,
                //             is_active: changeChecked == '1' ? true : false, // set current user
                //         };
                //     }
                //     return item;
                // });
                // dispatch(updateCustomerList({
                //     ...customerList,
                //     user: updatedList
                // }))
            } else {
                setis_load(false)
                TOAST_ERROR(response.message)
            }
        })
    }

    const handleDelete = (is_true) => {
        if (is_true) {
            dispatch(setLoader(true));
            let submitData = {
                user_id: selectedUser?.id,
                is_deleted: true
            }
            EditDailyWork(submitData).then((response) => {
                if (response.status_code === Codes?.SUCCESS) {
                    const updatedList = salaryList?.user?.filter((item) => item.id !== selectedUser?.id);
                    dispatch(updateDailyTaskList({
                        ...salaryList,
                        user: updatedList
                    }))
                    closeModel(dispatch)
                    dispatch(setLoader(false))
                    TOAST_SUCCESS(response?.message);
                } else {
                    closeModel(dispatch)
                    TOAST_ERROR(response?.message)
                    dispatch(setLoader(false))
                }
            });
        }
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        if (_filters['global']) { // Check if _filters['global'] is defined
            _filters['global'].value = value;
        }

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    // ---------------------------------- Export Data ----------------------------------

    const handleExportApiCall = async () => {
        dispatch(setLoader(true));
        let submitData = {
            search: globalFilterValue
        }
        const salaryData = salaryList?.map((salary, index) => ({
            id: index + 1,
            employeeID: `${salary?.emp_id || '-'}`,
            EmployeeName: `${salary?.name || '-'}`,
            FullDays: salary?.fullDays || '-',
            HalfDays: `${salary?.halfDays || '-'}`,
            Absent: salary?.absences,
            OffDayCount: salary?.offDayCount || '-',
            Sundays: salary?.sundays || '-',
            BirthdayLeave: salary?.birthdayLeave || '-',
            CasualLeave: salary?.casualLeave || '-',
            CompOffLeave: salary?.compOffLeave || '-',
            LWP: salary?.LWP || '-',
            MonthlySalary: salary?.monthlySalary || '-',
            payable_days: salary?.payableDays || '-',
            totalSalary: salary?.totalSalary || '-',
            // CreateUser: formatDate(salary?.created_at, DateFormat?.DATE_FORMAT) || '-'
        }));
        return { code: 1, data: salaryData }
    };

    const handleExportToPdfManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code == Codes.SUCCESS) {
            ExportToPdf(data, 'Customer List', 'Customer List');
        }
        dispatch(setLoader(false));
    };

    const handleExportToCSVManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code == Codes.SUCCESS) {
            ExportToCSV(data, 'Salary List');
        }
        dispatch(setLoader(false));
    };

    const handleExportToExcelManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code == Codes.SUCCESS) {
            ExportToExcel(data, 'Salary List');
        }
        dispatch(setLoader(false));
    };

    const onPageChange = (Data) => {
        setPage(Data)
    }

    const handleSort = (event) => {
        console.log("Sort event triggered:", event);
        setSortField(event.sortField); // ✅ correct key
        setSortOrder(event.sortOrder);
    };

    const onChangeApiCalling = (data) => {
        const request = {
            month: data?.date ? formatDateDyjs(data.date, 'MM') : null,
            year: data?.date ? formatDateDyjs(data.date, 'YYYY') : null,
            emp_leave_company: data?.emp_leave_company ? data?.emp_leave_company : "0"
        };
        dispatch(getSalaryListThunk(request));
    };

    return (
        <>
            <div className="container-fluid mw-100">
                <SubNavbar title={"Salary Details"} header={'Salary Details'} />
                <div className="widget-content searchable-container list">
                    <div className="card card-body shadow-sm border-0">
                        <div className="py-3 p-4">
                            <div className="row g-3 mb-3">
                                <div className="col-12 col-md-6 col-lg-10">
                                    <h3 className="text-center  text-custom-theam mt-2 fw-semibold">
                                        Salary Summary {formatDateDyjs(startDate, DateFormat?.DATE_MONTH_NAME_FORMAT)}
                                    </h3>
                                </div>
                                <div className="col-12 col-md-6 col-lg-2">
                                    <DatePicker
                                        className="custom-datepicker w-100 p-2"
                                        picker="month"
                                        format={dateFormat}
                                        value={startDate}
                                        onChange={(date) => {
                                            setStartDate(date);
                                            onChangeApiCalling({
                                                date: date,
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                            <hr className='mb-4' />

                            <div className="row g-3">

                                {/* Full Days */}
                                <div className="col-md-4 col-sm-6">
                                    <div className="card shadow-sm p-3 px-3 py-4 border-1">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="d-flex align-items-center">
                                                <BsCheckCircle size={30} className="text-success me-2" />
                                                <span className="fw-medium fs-4">Full Days</span>
                                            </span>
                                            <strong className="fw-medium fs-4">{salaryList?.fullDays}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Half Days */}
                                <div className="col-md-4 col-sm-6">
                                    <div className="card shadow-sm p-3 px-3 py-4 border-1">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="d-flex align-items-center">
                                                <BsCircleHalf size={30} className="text-warning me-2" />
                                                <span className="fw-medium fs-4">Half Days</span>
                                            </span>
                                            <strong className="fw-medium fs-4">{salaryList?.halfDays}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Absences */}
                                <div className="col-md-4 col-sm-6">
                                    <div className="card shadow-sm p-3 px-3 py-4 border-1">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="d-flex align-items-center">
                                                <BsXCircle size={30} className="text-danger me-2" />
                                                <span className="fw-medium fs-4">Absences</span>
                                            </span>
                                            <strong className="fw-medium fs-4">{salaryList?.absences}</strong>
                                        </div>
                                    </div>
                                </div>



                                {/* Casual Leaves */}
                                <div className="col-md-4 col-sm-6">
                                    <div className="card shadow-sm p-3 px-3 py-4 border-1">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="d-flex align-items-center">
                                                <BsPersonDash size={30} className="text-secondary me-2" />
                                                <span className="fw-medium fs-4">Casual Leaves</span>
                                            </span>
                                            <strong className="fw-medium fs-4">{salaryList?.casualLeave}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Comp Off Leaves */}
                                <div className="col-md-4 col-sm-6">
                                    <div className="card shadow-sm p-3 px-3 py-4 border-1">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="d-flex align-items-center">
                                                <BsArrowRepeat size={30} className="text-secondary me-2" />
                                                <span className="fw-medium fs-4">Comp Off Leaves</span>
                                            </span>
                                            <strong className="fw-medium fs-4">{salaryList?.compOffLeave || 0}</strong>
                                        </div>
                                    </div>
                                </div>
                                {/* LWP */}
                                <div className="col-md-4 col-sm-6">
                                    <div className="card shadow-sm p-3 px-3 py-4 border-1">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="d-flex align-items-center">
                                                <BsDashCircle size={30} className="text-danger me-2" />
                                                <span className="fw-medium fs-4">LWP</span>
                                            </span>
                                            <strong className="fw-medium fs-4">{salaryList?.LWPLeave || 0}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Holidays */}
                                <div className="col-md-4 col-sm-6">
                                    <div className="card shadow-sm p-3 px-3 py-4 border-1">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="d-flex align-items-center">
                                                <BsGift size={30} className="text-custom-theam me-2" />
                                                <span className="fw-medium fs-4">Holidays</span>
                                            </span>
                                            <strong className="fw-medium fs-4">{salaryList?.holidayCount || 0}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Off Days */}
                                <div className="col-md-4 col-sm-6">
                                    <div className="card shadow-sm p-3 px-3 py-4 border-1">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="d-flex align-items-center">
                                                <BsCalendarMinus size={30} className="text-custom-theam me-2" />
                                                <span className="fw-medium fs-4">Off Days</span>
                                            </span>
                                            <strong className="fw-medium fs-4">{salaryList?.offDayCount || 0}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Sundays */}
                                <div className="col-md-4 col-sm-6">
                                    <div className="card shadow-sm p-3 px-3 py-4 border-1">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="d-flex align-items-center">
                                                <BsCalendarWeek size={30} className="text-custom-theam me-2" />
                                                <span className="fw-medium fs-4">Sundays</span>
                                            </span>
                                            <strong className="fw-medium fs-4">{salaryList?.sundays || 0}</strong>
                                        </div>
                                    </div>
                                </div>
                                {/* Payable Days */}
                                <div className="col-md-6 col-sm-12">
                                    <div className="card shadow-sm p-3 h-100 border-secondary border-1">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="d-flex align-items-center">
                                                <BsCalendarCheck size={35} className="text-secondary me-2" />
                                                <span className="fw-bold">Days In Month</span>
                                            </span>
                                            <strong className="fs-5 ">{salaryList?.daysInMonth || "0.00"}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Payable Days */}
                                <div className="col-md-6 col-sm-12">
                                    <div className="card shadow-sm p-3 h-100 border-secondary border-1">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="d-flex align-items-center">
                                                <BsCalendarCheck size={35} className="text-secondary me-2" />
                                                <span className="fw-bold">Payable Days</span>
                                            </span>
                                            <strong className="fs-5 ">{salaryList?.payableDays || "0.00"}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Monthly Salary */}
                                <div className="col-md-6 col-sm-12">
                                    <div className="card shadow-sm p-3 h-100 border-secondary border-1">
                                        <div className="d-flex justify-content-between align-items-center ">
                                            <span className="d-flex align-items-center">
                                                <BsCashCoin size={35} className="text-secondary me-2" />
                                                <span className="fw-bold">Monthly Salary</span>
                                            </span>
                                            <strong className="fs-5 ">
                                                ₹{salaryList?.monthlySalary || "0.00"}
                                            </strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Monthly Salary */}
                                <div className="col-md-6 col-sm-12">
                                    <div className="card shadow-sm p-3 h-100 border-success border-1">
                                        <div className="d-flex justify-content-between align-items-center ">
                                            <span className="d-flex align-items-center">
                                                <BsCurrencyRupee size={35} className="text-success me-2" />
                                                <span className="fw-semibold text-success">Payable Salary</span>
                                            </span>
                                            <strong className="fs-5 text-success">
                                                ₹ {salaryList?.totalSalary || "0.00"}
                                            </strong>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                customModel.isOpen && customModel?.modalType === ModelName.DELETE_MODEL && (
                    <Model>
                        <DeleteComponent onConfirm={handleDelete} />
                    </Model >
                )
            }
        </>
    )
}


