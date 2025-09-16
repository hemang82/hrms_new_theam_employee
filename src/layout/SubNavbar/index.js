import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Constatnt, { PUBLIC_URL } from '../../config/constant';
import { useDispatch, useSelector } from 'react-redux';
import { updateSlidebarToggle } from '../../Store/slices/MasterSlice';

export default function SubNavbar({ title, header, subHeader, subHeaderOnlyView }) {

    const { slidebarToggle } = useSelector((state) => state.masterslice);
    const { userDetails: { data: userDetails }, } = useSelector((state) => state.masterslice);


    const location = useLocation();
    const dispatch = useDispatch();

    const path = location?.pathname
    let splitPath = path?.split('/')


    const btnClick = () => {
        console.log('button CLicked');
        console.log('slidebarToggle', slidebarToggle);
        const body = document.querySelector("body");
        if (body) {
            body.setAttribute("data-sidebartype", slidebarToggle ? "mini-sidebar" : "full");
        }
        const screenWidth = window.innerWidth;
        if (screenWidth <= 992) {
            const leftSideMenu = document.getElementById("left_side_menu_id");
            if (leftSideMenu) {
                leftSideMenu.style.display = slidebarToggle ? "none" : "block";
            }
        }
    };
    return (
        <>
            {/* </header> */}
            <div className="card bg-light-info shadow-none border-0 position-relative make-header">
                <div className="card-body px-4 py-3">
                    <div className="row align-items-center">

                        {/* Left Section: Sidebar Toggle + Breadcrumb */}
                        <div className="col-12 col-md-9 d-flex align-items-center gap-3 mb-3 mb-md-0">

                            {/* Sidebar Toggle */}
                            <button
                                type="button"
                                className="btn btn-light d-flex align-items-center justify-content-center p-2 shadow-sm rounded-circle"
                                onClick={() => {
                                    dispatch(updateSlidebarToggle(!slidebarToggle));
                                    btnClick();
                                }}
                            >
                                <i className="ti ti-menu-2 fs-5"></i>
                            </button>

                            {/* Breadcrumb */}
                            <nav aria-label="breadcrumb" className="ms-2">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/dashboard" className="text-decoration-none">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to={`/${splitPath?.[1]}`} className="text-decoration-none">
                                            {header}
                                        </Link>
                                    </li>
                                    {subHeader && (
                                        <li className="breadcrumb-item">
                                            <Link to={path} className="text-decoration-none">{subHeader}</Link>
                                        </li>
                                    )}
                                    {subHeaderOnlyView && (
                                        <li className="breadcrumb-item active" aria-current="page">
                                            {subHeaderOnlyView}
                                        </li>
                                    )}
                                </ol>
                            </nav>
                        </div>

                        {/* Right Section: Optional Image/Graphic */}
                        <div className="col-12 col-md-3 d-flex justify-content-md-end justify-content-center">
                            <div className="collapse navbar-collapse justify-content-end">
                                <div className="d-flex align-items-center justify-content-between">
                                    {/* Mobile Toggle */}
                                    <a
                                        className="nav-link d-flex d-lg-none align-items-center justify-content-center"
                                        type="button"
                                        data-bs-toggle="offcanvas"
                                        data-bs-target="#mobilenavbar"
                                        aria-controls="mobilenavbar"
                                    >
                                        <i className="ti ti-align-justified fs-7" />
                                    </a>

                                    <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-center">
                                        <li className="nav-item dropdown">
                                            {/* Avatar Button */}
                                            <a
                                                className="nav-link pe-0 cursor_pointer"
                                                id="profileDropdown"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                <div className="d-flex align-items-center">
                                                    <div className="user-profile-img">
                                                        <img
                                                            src={Constatnt?.Lone_LOGO}
                                                            className="rounded-circle"
                                                            width={40}
                                                            height={40}
                                                            alt="User Profile"
                                                        />
                                                    </div>
                                                </div>
                                            </a>

                                            {/* Dropdown Menu */}
                                            <div
                                                className="dropdown-menu dropdown-menu-end shadow-sm p-0"
                                                aria-labelledby="profileDropdown"
                                            >
                                                <div className="profile-dropdown">
                                                    {/* Header */}
                                                    <div className="py-3 px-4 border-bottom">
                                                        <h5 className="mb-0 fs-6 fw-semibold">User Profile</h5>
                                                    </div>

                                                    {/* User Info */}
                                                    <div className="d-flex align-items-center py-3 px-4 border-bottom">
                                                        <img
                                                            src={Constatnt?.Lone_LOGO}
                                                            className="rounded-circle"
                                                            width={50}
                                                            height={50}
                                                            alt="User Profile"
                                                        />
                                                        <div className="ms-3">
                                                            <h6 className="mb-1 fw-semibold">Admin</h6>
                                                            <p className="mb-0 text-muted small d-flex align-items-center gap-2">
                                                                <i className="ti ti-mail fs-6" /> admin@gmail.com
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Menu Items */}
                                                    <div className="list-group list-group-flush">
                                                        <Link
                                                            to="/my_profile"
                                                            className="list-group-item list-group-item-action d-flex align-items-center"
                                                        >
                                                            <span className="d-flex align-items-center justify-content-center bg-light rounded p-2">
                                                                <img
                                                                    src={PUBLIC_URL + "/dist/images/svgs/icon-account.svg"}
                                                                    alt="Account Icon"
                                                                    width={22}
                                                                    height={22}
                                                                />
                                                            </span>
                                                            <div className="ps-3">
                                                                <h6 className="mb-0 fw-semibold">My Profile</h6>
                                                                <small className="text-muted">Account Settings</small>
                                                            </div>
                                                        </Link>
                                                    </div>

                                                    {/* Logout Button */}
                                                    <div className="d-grid py-3 px-4 border-top">
                                                        {/* <button
                                                            onClick={() => {
                                                                openModel(dispatch, ModelName.LOGOUT_MODEL);
                                                            }}
                                                            className="btn btn-primary w-100 rounded-2"
                                                        >
                                                            Log Out
                                                        </button> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div >

        </>
    )
}

//  <div className="card bg-light-info shadow-none position-relative overflow-hidden">
//                 <div className="card-body px-4 py-3">
//                     <div className="row align-items-center">
//                         <div className="col-9">
//                             <h4 className="fw-semibold mb-8">{title}</h4>
//                             <nav aria-label="breadcrumb">
//                                 <ol className="breadcrumb">
//                                     <li className="breadcrumb-item"><Link className="" to={'/dashboard'}>Dashboard</Link></li>
//                                     <li className="breadcrumb-item" aria-current="page">
//                                         <Link to={`/${splitPath?.[1]}`} className="text-decoration-none">
//                                             {header}
//                                         </Link>
//                                     </li>
//                                     {subHeader ?
//                                         <li className="breadcrumb-item"><Link to={path} >{subHeader}</Link></li> : <></>
//                                     }
//                                     {subHeaderOnlyView ?
//                                         <li className="breadcrumb-item active"><a>{subHeaderOnlyView}</a></li> : <></>
//                                     }
//                                 </ol>
//                             </nav>
//                         </div>
//                         <div className="col-3">
//                             <div className="text-center mb-n5">
//                                 {/* <img src={PUBLIC_URL + "/dist/images/breadcrumb/ChatBc.png"} alt className="img-fluid mb-n4" /> */}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>