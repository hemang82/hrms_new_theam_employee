

import React, { useEffect, useRef, useState } from 'react'
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
import { formatDate, TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';

const Index = () => {

    let dispatch = useDispatch();

    const { listAllLoan: { data: loanList }, } = useSelector((state) => state.masterslice);
    const { userDetails: { data: userDetails }, } = useSelector((state) => state.masterslice);
    const { birthdayAndAnnivarsary: { data: birthdayList }, } = useSelector((state) => state.masterslice);
    // const { dailyTeaList: { data: drinkList }, } = useSelector((state) => state.masterslice);


    const [dashboard, setDashboard] = useState({});
    const [drinkList, setDrinkList] = useState([]);
    // const [birthdayList, setBirthdayList] = useState([]);

    const [isLoad, setIsLoad] = useState(false);

    const [options, setOptions] = useState({
        loop: true,
        margin: 10,
        autoplay: true,
        autoplayTimeout: 1500,  // ⏱️ wait 2.5s before next slide
        autoplaySpeed: 1000,    // smooth transition speed
        autoplayHoverPause: true,
        dots: true,             // show bottom dots
        nav: false,
        smartSpeed: 1000,
        responsive: {
            0: { items: 1 },
            576: { items: 1 },
            992: { items: 2 },
        },
    });


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

            const res2 = await API.DailyDrinkList({ action: 'self' });
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

            // const res1 = await API.birthdayAndAnnivarsary();
            // if (res1?.code == Codes.SUCCESS) {
            //     const data = res1.data;
            //     setBirthdayList(data);
            //     if (data.length > 1) {
            //         setOptions({
            //             loop: true,
            //             margin: 10,
            //             autoplay: true,
            //             autoplayTimeout: 1500,
            //             autoplayHoverPause: true,
            //             dots: true,
            //             nav: false,
            //             smartSpeed: 800,
            //             responsive: {
            //                 0: { items: 1 },
            //                 576: { items: 1 },
            //                 992: { items: 1 },
            //             },
            //         });
            //     } else {
            //         setOptions({
            //             loop: false,
            //             margin: 10,
            //             autoplay: false,
            //             dots: false,
            //             nav: false,
            //             responsive: {
            //                 0: { items: 1 },
            //                 576: { items: 1 },
            //             },
            //         });
            //     }
            // } else {
            //     setBirthdayList([]);
            // }
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

    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        let animationFrameId;
        const COLORS = [
            [255, 99, 132],
            [54, 162, 235],
            [255, 206, 86],
            [75, 192, 192],
            [153, 102, 255],
            [255, 159, 64],
        ];
        const PI_2 = 2 * Math.PI;
        const NUM_CONFETTI = 80;
        let confetti = [];
        let w = 0;
        let h = 0;
        let xpos = 0.5;

        const resizeCanvas = () => {
            const rect = canvas.parentNode.getBoundingClientRect();
            w = canvas.width = rect.width;
            h = canvas.height = rect.height;
        };

        class Confetti {
            constructor() {
                this.style = COLORS[~~(Math.random() * COLORS.length)];
                this.rgb = `rgba(${this.style[0]},${this.style[1]},${this.style[2]}`;
                this.r = ~~(Math.random() * 6) + 2;
                this.replace();
            }
            replace() {
                this.opacity = 0;
                this.dop = 0.01 * (Math.random() * 3 + 1);
                this.x = Math.random() * w;
                this.y = Math.random() * h - h;
                this.xmax = w - this.r;
                this.ymax = h - this.r;
                this.vx = (Math.random() - 0.5) * 0.8;  // reduce horizontal speed too
                this.vy = 0.2 * this.r + Math.random() * 0.2; // much slower fall
            }
            draw() {
                this.x += this.vx;
                this.y += this.vy;
                this.opacity += this.dop;
                if (this.opacity > 1) {
                    this.opacity = 1;
                    this.dop *= -1;
                }
                if (this.opacity < 0 || this.y > this.ymax) this.replace();
                if (this.x < 0 || this.x > this.xmax)
                    this.x = (this.x + this.xmax) % this.xmax;
                context.beginPath();
                context.arc(this.x, this.y, this.r, 0, PI_2, false);
                context.fillStyle = `${this.rgb},${this.opacity})`;
                context.fill();
            }
        }

        const initConfetti = () => {
            confetti = Array.from({ length: NUM_CONFETTI }, () => new Confetti());
        };

        const animate = () => {
            context.clearRect(0, 0, w, h);
            confetti.forEach((c) => c.draw());
            animationFrameId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        initConfetti();
        animate();

        window.addEventListener("resize", resizeCanvas);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [birthdayList]);

    const data = "";
    const type = "";

    console.log('birthdayList', birthdayList);

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

                <div className="row mt-3 mb-3 p-3">
                    {
                        birthdayList?.length > 0 &&
                        <div className="col-12 col-sm-6 col-lg-6 col-md-12 border border-1 rounded-3 shadow-sm mb-3">
                            <OwlCarousel
                                key={birthdayList?.length} // ✅ re-renders when data count changes
                                className="owl-theme"
                                {...options}
                            >
                                {birthdayList?.map((data, index) => (
                                    <div key={index} className="col-12">
                                        <div className="card position-relative rounded-4 mx-auto my-4 shadow-md border-1"
                                            style={{
                                                maxWidth: "22rem",
                                                background: "rgba(255, 255, 255, 0.6)",
                                                backdropFilter: "blur(10px)",
                                                overflow: "hidden",
                                            }}
                                        >

                                            <canvas className="position-absolute top-0 start-0 w-100 h-100" ref={canvasRef} style={{ zIndex: 0 }} />

                                            <div className="d-flex justify-content-center mt-4 position-relative" style={{ zIndex: 2 }} >
                                                <div className="bg-white rounded-circle p-1 ">
                                                    <img
                                                        src={"/dist/images/logos/hrms_icon.png"}
                                                        alt="profile"
                                                        className="rounded-circle border border-3 border-white shadow"
                                                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="card-body text-center position-relative" style={{ zIndex: 2 }}>
                                                <h5
                                                    className="fw-semibold fs-5 text-custom-theam"
                                                    style={{
                                                        // background: "linear-gradient(90deg, #ff4b2b, #ff416c, #ff6a00)",
                                                        // WebkitBackgroundClip: "text",
                                                        // WebkitTextFillColor: "transparent",
                                                    }}
                                                >
                                                    {data?.name}
                                                </h5>

                                                <p className="text-muted small  fw-semibold">{data?.date}</p>

                                                <p className="fw-semibold fs-6 text-custom-theam text-nowrap ">
                                                    {data?.type == "Anniversary"
                                                        ? "🌟Happy Work Anniversary!🌟"
                                                        : "🎉 Happy Birthday! 🎂"}
                                                </p>

                                                <p className="text-secondary mt-2 lh-base">
                                                    {data?.type == "Anniversary"
                                                        ? "Thank you for your amazing contributions! Wishing you continued success and growth with us."
                                                        : "🎉 Wishing you joy, success, and happiness on your special day.💐"}
                                                </p>

                                                <div className="text-center mb-2 position-relative" style={{ zIndex: 2 }}>
                                                    {data?.type === "Anniversary" ? (
                                                        <span className="fs-4 floating">🎊🥳🏆</span>
                                                    ) : (
                                                        <span className="fs-4 floating">🎈🎉🎂🎊</span>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </OwlCarousel>
                        </div>
                    }

                    <div className={`col-12 col-sm-6 ${birthdayList?.length > 0 ? 'col-lg-6' : 'col-lg-12'} col-md-12 `}>
                        <div className="card card-body rounded-3 mb-3 border-1 rounded-3 shadow-sm">
                            <div className="">
                                <div className="py-2 border-bottom d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">

                                    {/* <div className="">
                                        <h5 className="text-secondary mb-0 fw-semibold fs-6">
                                            {timeOfDay === 'morning' ?
                                                `Hey ${userDetails?.name || '-'}, Good Morning!` :
                                                timeOfDay === 'afternoon' ?
                                                    `Hey ${userDetails?.name || '-'}, Good Afternoon!` :
                                                    timeOfDay === 'evening' ?
                                                        `Hey ${userDetails?.name || '-'}, Good Evening!` :
                                                        'Good Day, Enjoy your Drink!'}
                                        </h5>
                                    </div> */}

                                    <div className="gap-2 d-flex flex-wrap align-items-center justify-content-end mt-3 mt-md-0 mb-3 ms-4">
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

                                        <Column field="date" header="Date" style={{ minWidth: '10rem' }} body={(rowData) => (
                                            <span className='me-2'>{momentDateFormat(rowData?.date, DateFormat?.DATE_WEEK_MONTH_NAME_FORMAT) || '-'} </span>
                                        )} />

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

            </div>
        </>
    );
}

export default Index;
