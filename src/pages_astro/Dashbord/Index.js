

import React, { useEffect, useState } from 'react'
import Header from '../../layout/Header'
import * as API from '../../utils/api.services';
import { useDispatch, useSelector } from 'react-redux';
import { setLoader } from '../../Store/slices/MasterSlice';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import OwlCarousel from 'react-owl-carousel';
import { Codes, PUBLIC_URL } from '../../config/constant';
import { PATHS } from '../../Router/PATHS';
import SubNavbar from '../../layout/SubNavbar';
import { CalendarDays } from "lucide-react"; // 📅 React Icon
import moment from 'moment';
import dayjs from 'dayjs';
import { formatDateDyjs, getBreakMinutes, getWorkingHours, momentDateFormat, momentNormalDateFormat, momentTimeFormate } from '../../config/commonFunction';
import { DateFormat, getAttendanceStatusColor, getStatus, TimeFormat } from '../../config/commonVariable';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { IoAddCircleOutline } from 'react-icons/io5';
import { PiBowlSteam } from 'react-icons/pi';
import { VscCoffee } from "react-icons/vsc";
import { FaCoffee } from 'react-icons/fa';
import { TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';

const Index = () => {

    let dispatch = useDispatch();

    const { listAllLoan: { data: loanList }, } = useSelector((state) => state.masterslice);
    const { userDetails: { data: userDetails }, } = useSelector((state) => state.masterslice);


    const [dashboard, setDashboard] = useState({});
    const [drinkList, setDrinkList] = useState([]);
    const [isLoad, setIsLoad] = useState(false);

    const fetchDashboardData = async () => {
        try {
            // dispatch(setLoader(true));
            const res = await API.DashboardCount({});
            if (res?.code == Codes.SUCCESS) {
                setDashboard(res?.data);
            } else {
                setDashboard([]);
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            // dispatch(setLoader(false));
        }
    };

    const fetchTeaData = async () => {
        try {
            // dispatch(setLoader(true));
            const res2 = await API.DailyDrinkList({});
            if (res2?.code == Codes.SUCCESS) {
                // Add a new object to the list
                const totalData = {
                    "employee_id": "01",
                    "employee_name": "Total",
                    "morning_tea": res2?.data?.total?.total_morning_tea,
                    "morning_coffee": res2?.data?.total?.total_morning_coffee,
                    "evening_tea": res2?.data?.total?.total_evening_tea,
                    "evening_coffee": res2?.data?.total?.total_evening_coffee
                };

                // Spread the fetched data and append the new "Total" object at the end
                setDrinkList([
                    ...res2?.data?.list,
                    totalData
                ]);

            } else {
                setDrinkList([]); // If the API call fails, set an empty list
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            // dispatch(setLoader(false));
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        fetchTeaData()
    }, [isLoad])

    const dashboardCards = [
        {
            title: "Check In Time",
            icon: "/dist/images/svgs/Check_in.svg",
            value: `${dashboard?.checkInTimes?.length > 0 ? momentTimeFormate(dashboard?.checkInTimes[0], TimeFormat.TIME_12_HOUR_FORMAT) || '-' : "-"}`,
            link: 'PATHS?.EMPLOYEE_LIST'
        },
        {
            title: "Check Out Time",
            icon: "/dist/images/svgs/Check_out.svg",
            value: `${dashboard?.checkOutTimes?.length > 0 ? momentTimeFormate(dashboard?.checkOutTimes[0], TimeFormat.TIME_12_HOUR_FORMAT) || '-' : "-"}`,
            link: 'PATHS?.ATTENDANCE_LIST'
        },
        {
            title: "Working Hours",
            icon: "/dist/images/svgs/Hours.svg",
            // value: getWorkingHours(dashboard?.first_check_in_time ? dayjs(dashboard?.first_check_in_time,"HH:mm:ss").format("HH:mm:ss") : 0, dayjs(dashboard?.last_check_out_time || dayjs() , "HH:mm:ss").format("HH:mm:ss"), getBreakMinutes(0)) || 0,
            value: `${dashboard?.checkInTimes?.length > 0 ? getWorkingHours(dashboard?.checkInTimes[0], dashboard?.checkOutTimes[0], getBreakMinutes(dashboard?.breaks?.length > 0 ? dashboard?.breaks : [] || 0)) || '-' : "-"}`,
            link: 'PATHS?.ATTENDANCE_LIST'
        },
        {
            title: "Estimated Completed Time",
            icon: "/dist/images/svgs/hourglass.svg",
            // value: getWorkingHours(dashboard?.first_check_in_time ? dayjs(dashboard?.first_check_in_time,"HH:mm:ss").format("HH:mm:ss") : 0, dayjs(dashboard?.last_check_out_time || dayjs() , "HH:mm:ss").format("HH:mm:ss"), getBreakMinutes(0)) || 0,
            value: `${dashboard?.estimatedCompletionTime ? momentTimeFormate(dashboard?.estimatedCompletionTime, TimeFormat.TIME_12_HOUR_FORMAT) || '-' : "-"}`,
            link: 'PATHS?.ATTENDANCE_LIST'
        },
    ];

    const [timeOfDay, setTimeOfDay] = useState('morning'); // Default to 'morning'

    useEffect(() => {
        const currentHour = new Date().getHours();
        if (currentHour >= 6 && currentHour < 12) {
            setTimeOfDay('morning');
        } else if (currentHour >= 12 && currentHour < 17) {
            setTimeOfDay('afternoon');
        } else if (currentHour >= 17 && currentHour < 21) {
            setTimeOfDay('evening');
        } else {
            setTimeOfDay('night'); // Optional night period if needed
        }
    }, []);

    const handleAddDrink = async (drink, drinkType) => {
        try {
            // Start loading
            dispatch(setLoader(true));
            setIsLoad(true);

            // Prepare the request payload
            let request = {
                action: "self",
                date: formatDateDyjs(dayjs(), DateFormat?.DATE_LOCAL_DASH_TIME_FORMAT),
                slot: drinkType, // morning or evening
                drink: drink, // Tea, Coffee, NA
            };

            // API call
            const response = await API.DailyDrinkAdd(request);

            // Handle response
            if (response?.code == Codes?.SUCCESS) {
                TOAST_SUCCESS(
                    `${timeOfDay === "morning" ? "Morning" : "Afternoon"} ${drink} Added Successfully`
                );
            } else {
                TOAST_ERROR(response?.message);
            }
        } catch (error) {
            // Handle unexpected errors
            TOAST_ERROR("An error occurred while adding the drink.");
            console.error("Error in handleAddDrink:", error);
        } finally {
            // Reset loading state
            setIsLoad(false);
            dispatch(setLoader(false));
        }
    };

    const findEmployeeById = (employeeId) => {
        return drinkList.find(item => item.employee_id === employeeId);
    };

    return (
        <>
            <div className="container-fluid mw-100">
                <SubNavbar />
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mt-3 ">
                    {dashboardCards?.map((card, index) => (
                        <div className="col" key={index}>
                            <div className="card shadow-sm border-1 rounded-3 h-100">
                                <div className="card-body text-center d-flex flex-column justify-content-center">
                                    <Link className="text-decoration-none">
                                        <img
                                            src={PUBLIC_URL + card.icon}
                                            width={40}
                                            height={40}
                                            className="mb-3"
                                            alt={card.title}
                                        />
                                        <p className="card-text text-muted mb-1 fw-semibold">{card.title}</p>
                                        <h4 className="card-title fw-semibold text-custom-theam">{card.value}</h4>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row mt-3 mb-3">
                    <div className="col-12 col-sm-12 col-lg-12 col-md-12">
                        <div className="card card-body rounded-3">
                            <div className="">
                                <div className="py-2 border-bottom d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
                                    <div className="">
                                        <h5 className="text-secondary mb-0 fw-semibold fs-6">
                                            {timeOfDay === 'morning' ?
                                                `Hey ${userDetails?.name || '-'}, Good Morning!` :
                                                timeOfDay === 'afternoon' ?
                                                    `Hey ${userDetails?.name || '-'}, Good Afternoon!` :
                                                    timeOfDay === 'evening' ?
                                                        `Hey ${userDetails?.name || '-'}, Good Evening!` :
                                                        'Good Day, Enjoy your Drink!'}
                                        </h5>
                                    </div>

                                    <div className=" gap-2 d-flex flex-wrap align-items-center justify-content-end mt-3 mt-md-0">
                                        <Link
                                            id="btn-add-tea"
                                            className="btn btn-info d-flex align-items-center justify-content-center w-100 w-md-auto text-truncate mb-2 mb-md-0 dashboard_btn"
                                            style={{ height: '40px' }}
                                            onClick={() => { handleAddDrink('Tea', 'morning') }}

                                        // onClick={() => {
                                        //     const employee = findEmployeeById(54);
                                        //     if (timeOfDay == 'morning' ? employee && employee?.morning_tea == 0 : employee && employee?.evening_tea == 0) {
                                        //         handleAddDrink('Tea');
                                        //     }
                                        // }}
                                        >
                                            <span className="me-1">
                                                <FaCoffee style={{ fontSize: '1.2rem' }} />
                                            </span>
                                            <span className="fw-semibold">Morning Tea</span>
                                        </Link>

                                        <Link
                                            id="btn-add-coffee"
                                            className="btn btn-info d-flex align-items-center justify-content-center w-100 w-md-auto text-truncate dashboard_btn"
                                            style={{ height: '40px' }}
                                            onClick={() => { handleAddDrink('Coffee', 'morning') }}
                                        // onClick={() => {
                                        //     const employee = findEmployeeById(54);
                                        //     if (timeOfDay == 'morning' ? employee && employee?.morning_coffee == 0 : employee && employee?.evening_coffee == 0) {
                                        //         handleAddDrink('Coffee' , 'morning');
                                        //     }
                                        // }}
                                        >
                                            <span className="me-1">
                                                <VscCoffee style={{ fontSize: '1.2rem' }} />
                                            </span>
                                            <span className="fw-semibold">Morning Coffee</span>
                                        </Link>

                                        <Link
                                            id="btn-add-tea"
                                            className="btn btn-info d-flex align-items-center justify-content-center w-100 w-md-auto text-truncate mb-2 mb-md-0 dashboard_btn"
                                            style={{ height: '40px' }}
                                            onClick={() => { handleAddDrink('Tea', 'evening') }}
                                        // onClick={() => {
                                        //     const employee = findEmployeeById(54);
                                        //     if (timeOfDay == 'morning' ? employee && employee?.morning_tea == 0 : employee && employee?.evening_tea == 0) {
                                        //         handleAddDrink('Tea');
                                        //     }
                                        // }}
                                        >
                                            <span className="me-1">
                                                <FaCoffee style={{ fontSize: '1.2rem' }} />
                                            </span>
                                            <span className="fw-semibold">Evening Tea</span>
                                        </Link>

                                        <Link
                                            id="btn-add-coffee"
                                            className="btn btn-info d-flex align-items-center justify-content-center w-100 w-md-auto text-truncate dashboard_btn"
                                            style={{ height: '40px' }}
                                            onClick={() => { handleAddDrink('Coffee', 'evening') }}
                                        // onClick={() => {
                                        //     const employee = findEmployeeById(54);
                                        //     if (timeOfDay == 'morning' ? employee && employee?.morning_coffee == 0 : employee && employee?.evening_coffee == 0) {
                                        //         handleAddDrink('Coffee');
                                        //     }
                                        // }}
                                        >
                                            <span className="me-1">
                                                <VscCoffee style={{ fontSize: '1.2rem' }} />
                                            </span>
                                            <span className="fw-semibold">Evening Coffee</span>
                                        </Link>
                                    </div>


                                </div>

                                <div className="table-responsive" style={{ overflowX: 'auto' }}>
                                    <DataTable
                                        value={drinkList?.length ? drinkList : []}
                                        rows={20}
                                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                        emptyMessage={<span style={{ textAlign: 'center', display: 'block' }}>Drink not found.</span>}
                                        style={{ tableLayout: 'fixed' }} // Fixed table layout
                                    >
                                        <Column
                                            field="employee_name"
                                            header="Employees"
                                            style={{ minWidth: '8rem', textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                            body={(rowData) => <span className="me-2">{rowData.employee_name || '-'}</span>}
                                        />

                                        <Column
                                            field="morning_tea"
                                            header="Morning Tea"
                                            style={{ minWidth: '6rem', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                            body={(rowData) => <span className="me-2">{rowData.morning_tea || "-"}</span>}
                                        />

                                        <Column
                                            field="morning_coffee"
                                            header="Morning Coffee"
                                            style={{ minWidth: '6rem', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                            body={(rowData) => <span className="me-2">{rowData.morning_coffee || "-"}</span>}
                                        />

                                        <Column
                                            field="evening_tea"
                                            header="Evening Tea"
                                            style={{ minWidth: '6rem', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                            body={(rowData) => <span className="me-2">{rowData.evening_tea || "-"}</span>}
                                        />

                                        <Column
                                            field="evening_coffee"
                                            header="Evening Coffee"
                                            style={{ minWidth: '8rem', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                            body={(rowData) => <span className="me-2">{rowData.evening_coffee || "-"}</span>}
                                        />
                                    </DataTable>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="row">
                    {dashboardCards?.map((card, index) => (
                        <div className="col-12 col-sm-6 col-md-2 col-lg-3 " key={index}>
                            <div className="card border-1 zoom-in them-light shadow-sm">
                                <div className="card-body text-center">
                                    <Link to={card.link}>
                                        <img src={PUBLIC_URL + card.icon} width={35} height={35} className="mb-3" alt="Icon" />
                                        <p className="fw-semibold fs-5 text-dark mb-1">{card.title}</p>
                                        <h4 className="fw-semibold  text-dark mb-0">
                                            {
                                                <p className="fw-semibold fs-5 text-dark mb-1">{card.value}</p>
                                            }
                                        </h4>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> */}

                {/* Row 2: Astrologer Ratings and Consultation Data */}
                {/* <div className="row mt-3">
                    <div className="col-lg-6">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h4 className="header-title mb-3">Astrologer Ratings</h4>
                                <div>
                                    <ReactECharts
                                        option={ratingOption}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        theme={'light'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h4 className="header-title mb-3">Consultations Over Time</h4>
                                <div>
                                    <ReactECharts
                                        option={consultationOption}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        theme={'light'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </>
    );
}

export default Index;
