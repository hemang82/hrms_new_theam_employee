

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
import { getBreakMinutes, getWorkingHours, momentDateFormat, momentTimeFormate } from '../../config/commonFunction';
import { DateFormat, getAttendanceStatusColor, getStatus, TimeFormat } from '../../config/commonVariable';


const Index = () => {

    let dispatch = useDispatch();

    const { listAllLoan: { data: loanList }, } = useSelector((state) => state.masterslice);
    const { userDetails: { data: userDetails }, } = useSelector((state) => state.masterslice);

    const [dashboard, setDashboard] = useState({});

    const fetchDashboardData = async () => {
        try {
            // dispatch(setLoader(true));
            const res = await API.DashboardCount({});
            if (res?.code == Codes.SUCCESS) {
                setDashboard(res?.data);
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

    const dashboardCards = [
        // {
        //     title: "Date",
        //     icon: "/dist/images/svgs/Date.svg",
        //     value: <>
        //         {momentDateFormat(dashboard?.date, DateFormat?.DATE_WEEK_MONTH_NAME_FORMAT_WEEK) || '-'}
        //     </>,
        //     link: 'PATHS?.EMPLOYEE_LIST'
        // },
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
            title: "Estimated Completed Hours",
            icon: "/dist/images/svgs/hourglass.svg",
            // value: getWorkingHours(dashboard?.first_check_in_time ? dayjs(dashboard?.first_check_in_time,"HH:mm:ss").format("HH:mm:ss") : 0, dayjs(dashboard?.last_check_out_time || dayjs() , "HH:mm:ss").format("HH:mm:ss"), getBreakMinutes(0)) || 0,
            value: `${dashboard?.estimatedCompletionTime ? momentTimeFormate(dashboard?.estimatedCompletionTime, TimeFormat.TIME_12_HOUR_FORMAT) || '-' : "-"}`,
            link: 'PATHS?.ATTENDANCE_LIST'
        },
    ];

    console.log('dashboard', dashboard);

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
