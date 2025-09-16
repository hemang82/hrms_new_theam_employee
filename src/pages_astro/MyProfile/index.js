import React, { useEffect, useRef, useState } from 'react'
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../layout/Footer';
import { TOAST_ERROR, TOAST_SUCCESS, allowLettersAndSpaces, formatDate } from '../../config/common';
import SubNavbar from '../../layout/SubNavbar';
import profile_image from '../../assets/Images/default.jpg'
import { editEmployee, editProfile } from '../../utils/api.services';
import { uploadImageOnAWS } from '../../utils/aws.service';
import Constatnt, { AwsFolder, Codes, PUBLIC_URL } from '../../config/constant';
import CountryMobileNumber from '../../pages/CommonPages/CountryMobileNumber';
import ChangePassword from './ChangePassword';
import { useDispatch, useSelector } from 'react-redux';
import { setLoader } from '../../Store/slices/MasterSlice';
import { DateFormat, InputTypesEnum } from '../../config/commonVariable';
import { isValidInput, textValidation, handelInputText, momentNormalDateFormat, dayjsDateFormat } from '../../config/commonFunction';
import AppSettings from './AppSettings';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { PATHS } from '../../Router/PATHS';
import { FaUserEdit } from 'react-icons/fa';

const MyProfile = () => {

    const location = useLocation();
    const navigation = useNavigate();
    const imageRef = useRef();
    const dispatch = useDispatch()
    const profileData = JSON.parse(localStorage.getItem(Constatnt.AUTH_KEY))
    const { userDetails: { data: userDetails }, } = useSelector((state) => state.masterslice);

    // ---------------------- only redux api call for rendering page ----------------------------------------------

    const [profileModel, setProfileModel] = useState(null);

    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, formState: { errors } } = useForm();

    useEffect(() => {
        reset({
            profile_image: userDetails?.profile_image,
            name: userDetails?.name,
            email: userDetails?.email,
            mobile_number: userDetails?.phone_number,
            // date: momentNormalDateFormat(userDetails?.birth_date, DateFormat?.DATE_DASH_TIME_FORMAT, DateFormat?.DATE_FORMAT)
        });
        setValue('date', dayjsDateFormat(userDetails?.birth_date, DateFormat?.DATE_FORMAT))
    }, [userDetails])

    const onSubmitData = async (data) => {
        try {

            dispatch(setLoader(true))

            // let image = data?.profile_image;
            // if (image instanceof Blob) image = await uploadImageOnAWS(image, AwsFolder?.PROFILE_IMAGE);

            let request = {
                name: data?.name,
                birth_date: dayjsDateFormat(data?.date, DateFormat?.DATE_FORMAT),
                phone_number: data?.mobile_number,
                email: data?.email,
                // profile_photo : ""
            }
            editEmployee(request).then((response) => {
                if (response.code == Codes.SUCCESS) {
                    localStorage.setItem(Constatnt.AUTH_KEY, JSON.stringify(response?.data));
                    navigation(PATHS?.MY_PROFILE)
                    setProfileModel(false)
                    TOAST_SUCCESS(response.message);
                    dispatch(setLoader(false))
                } else {
                    dispatch(setLoader(false))
                    TOAST_ERROR(response.message);
                }
            })
        } catch (err) {
            TOAST_ERROR(err.message)
        }
    }

    return (
        <>
            <div className="container-fluid mw-100">

                <SubNavbar title={"Profile"} header={'Profile'} />

                <ul className="nav nav-pills user-profile-tab justify-content-end mt-2 border border-2 rounded-2 mb-3 " id="pills-tab" role="tablist">

                    <li className="nav-item" role="presentation">
                        <button className="nav-link position-relative rounded-0 active d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-followers-tab" data-bs-toggle="pill" data-bs-target="#pills-followers" type="button" role="tab" aria-controls="pills-followers" aria-selected="true">
                            <FaUserEdit size={22} className="me-2" />
                            <span className="d-none d-md-block">Edit Profile</span>
                        </button>
                    </li>

                    {/* <li className="nav-item" role="presentation">
                        <button className="nav-link position-relative rounded-0 active d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-settings" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">
                            <i className="ti ti-user-circle me-2 fs-6" />
                            <span className="d-none d-md-block">App Settings</span>
                        </button>
                    </li>

                    <li className="nav-item" role="presentation"> */}
                    {/* <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-settings-tab" data-bs-toggle="pill" data-bs-target="#pills-settings" type="button" role="tab" aria-controls="pills-settings" aria-selected="false">
                            <i className="ti ti-settings me-2 fs-6" />
                            <span className="d-none d-md-block">Chat Setting</span>
                        </button>
                    </li> */}

                    {/* <li className="nav-item" role="presentation">
                            <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-friends-tab" data-bs-toggle="pill" data-bs-target="#pills-friends" type="button" role="tab" aria-controls="pills-friends" aria-selected="false">
                                <i className="ti ti-user-circle me-2 fs-6" />
                                <span className="d-none d-md-block">Friends</span>
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-gallery-tab" data-bs-toggle="pill" data-bs-target="#pills-gallery" type="button" role="tab" aria-controls="pills-gallery" aria-selected="false">
                                <i className="ti ti-photo-plus me-2 fs-6" />
                                <span className="d-none d-md-block">Gallery</span>
                            </button>
                        </li> */}
                </ul>

                <div className="tab-content" id="pills-tabContent">

                    {/* <div className="tab-pane fade show active" id="pills-followers" role="tabpanel" aria-labelledby="pills-followers-tab" tabIndex={0}>
                        <ChangePassword />
                    </div> */}

                    <div className="tab-pane fade show active" id="pills-followers" role="tabpanel" aria-labelledby="pills-followers-tab" tabIndex={0}>

                        {/* <AppSettings /> */}


                        <div className="container-fluid border-0 mw-100">

                            <div className="justify-content-center">
                                <div className='row justify-content-center '>
                                    <div className="card">

                                        <div className="p-md-4 p-4 row_2">
                                            <div className="p-8 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                                <h5 className="text-secondary mb-0 fw-semibold fs-6">Employee Details</h5>

                                                <a className="btn btn-primary d-flex align-items-center px-3" id="add-notes" onClick={() => { setProfileModel(true) }}>
                                                    <i className="ti  me-0 me-md-1 fs-4" />
                                                    <span className="d-none d-md-block font-weight-medium fs-3" >Edit Profile</span>
                                                </a>
                                            </div>

                                            <div className="row">
                                                {[
                                                    { label: "Employee Id", value: userDetails?.employee_id },
                                                    { label: "Joining Date", value: formatDate(userDetails?.joining_date, DateFormat?.DATE_FORMAT) },
                                                    { label: "Name", value: userDetails?.name },
                                                    { label: "Gender", value: userDetails?.gender == "M" ? "Male" : userDetails?.gender == "F" ? "Female" : "Other" },
                                                    { label: "Email Address", value: userDetails?.email },
                                                    { label: "Mobile Number", value: `+91 ${userDetails?.phone_number}` },
                                                    { label: "Date Of Birth", value: formatDate(userDetails?.birth_date, DateFormat?.DATE_FORMAT) },
                                                    { label: "Password", value: userDetails?.password },
                                                    { label: "Designation", value: userDetails?.designation },
                                                    { label: "Department", value: userDetails?.dept_name },
                                                    { label: "Monthly Salary", value: userDetails?.salary_monthly },
                                                    { label: "Senior Name", value: userDetails?.senior_name },
                                                    { label: "Create Employee", value: formatDate(userDetails?.created_at, DateFormat?.DATE_FORMAT) },
                                                    { label: "Address", value: userDetails?.location },
                                                    // { label: "Employee Leave Date", value: userDetails?.emp_leave_company == '1' ? userDetails?.emp_leave_date : null },
                                                    // { label: "Employee Leave Reason", value: userDetails?.emp_leave_company == '1' ? userDetails?.emp_leave_reason : null },
                                                ].map((item, index) => (

                                                    <div key={index} className="col-md-4 mb-4">
                                                        {
                                                            item.label === "Image" ? (
                                                                <LazyLoadImage
                                                                    src={userDetails?.profile_image || Constatnt?.DEFAULT_IMAGE}
                                                                    alt="User Profile"
                                                                    width={50}
                                                                    height={50}
                                                                    className="rounded-circle object-cover border"
                                                                    style={{ objectFit: 'cover' }}
                                                                />
                                                            ) : <>
                                                                <p className="mb-1 fs-4">{item.label}</p>
                                                                <h6 className="fw-semibold mb-0 fs-5 text-capitalize">{item.value || 'N/A'}</h6>
                                                            </>
                                                        }
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {
                                userDetails?.account_no &&
                                <div className="justify-content-center">
                                    <div className='row justify-content-center '>
                                        <div className="card overflow-hidden chat-application ">

                                            <div className="p-md-4 p-4 row_2">

                                                <div className="p-8 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                                    <h5 className="text-secondary mb-0 fw-semibold fs-6">Bank Details</h5>
                                                </div>

                                                <div className="row">
                                                    {[
                                                        { label: "Account Name", value: userDetails?.account_holder_name },
                                                        { label: "Bank Name", value: userDetails?.bank_name },
                                                        { label: "Account Number", value: userDetails?.account_no },
                                                        { label: "IFSC Code Address", value: userDetails?.ifsc_code },
                                                        { label: "Bank Branch", value: userDetails?.branch },

                                                    ].map((item, index) => (

                                                        <div key={index} className="col-md-4 mb-4">
                                                            {
                                                                item.label === "Image" ? (
                                                                    <LazyLoadImage
                                                                        src={userDetails?.profile_image || Constatnt?.DEFAULT_IMAGE}
                                                                        alt="User Profile"
                                                                        width={50}
                                                                        height={50}
                                                                        className="rounded-circle object-cover border"
                                                                        style={{ objectFit: 'cover' }}
                                                                    />
                                                                ) : <>
                                                                    <p className="mb-1 fs-4">{item.label}</p>
                                                                    <h6 className="fw-semibold mb-0 fs-5 text-capitalize">{item.value || 'N/A'}</h6>
                                                                </>
                                                            }
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="offcanvas offcanvas-start user-chat-box" tabIndex={-1} id="chat-sidebar" aria-labelledby="offcanvasExampleLabel">

                            </div>
                        </div>
                    </div>


                    <div className="tab-pane fade" id="pills-friends" role="tabpanel" aria-labelledby="pills-friends-tab" tabIndex={2}>
                        <h1>3</h1>
                    </div>

                    <div className="tab-pane fade" id="pills-gallery" role="tabpanel" aria-labelledby="pills-gallery-tab" tabIndex={3}>
                        <h1>4</h1>
                    </div>

                    {/* </div> */}

                </div>

                {/* Modal Add notes */}

                <div className={`modal custom-modal  ${profileModel ? "fade show d-block " : "d-none"
                    }`}
                    id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document" >
                        <div className="modal-content border-0">
                            <div className="modal-header bg-primary" style={{ borderRadius: '10px 10px 0px 0px' }}>
                                <h6 className="modal-title text-dark fs-5">Edit Profile</h6>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setProfileModel(false) }} />
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit(onSubmitData)} >
                                    <div className="col-lg-12">
                                        {/* <div className="card"> */}
                                        <div className="card-body p-4">
                                            {/* <div className="mb-2">
                                                <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">Profile image<spna className="text-danger"> *</spna></label>
                                                <div className="d-flex justify-content-center">
                                                    <div className="col-5">
                                                        <div className="card border">
                                                            <div className="card-body">

                                                                <div
                                                                    className="dropzone p-2 cursor_pointer border rounded d-flex flex-column align-items-center justify-content-center"
                                                                    onClick={() => imageRef.current.click()}
                                                                >
                                                                    {ShowProfileImage ? (
                                                                        <div
                                                                            className="image-container d-flex align-items-center justify-content-center"
                                                                            style={{ height: "100%", width: "100%" }}
                                                                        >
                                                                            <img
                                                                                src={ShowProfileImage}
                                                                                alt="Profile Preview"
                                                                                className="dz-default dz-message rounded-circle border"
                                                                                style={{ objectFit: "cover", height: "80px", width: "80px" }}
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="dz-default dz-message fs-6 text-muted text-center">
                                                                            Upload Image
                                                                        </div>
                                                                    )}

                                                                    {/* Hidden input to trigger upload */}
                                            {/* <input
                                                type="file"
                                                accept="image/*"
                                                ref={imageRef}
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        const file = e.target.files[0];
                                                        const imageUrl = URL.createObjectURL(file);
                                                        setShowProfileImage(imageUrl); // state setter
                                                    }
                                                }}
                                                hidden
                                            /> */}
                                            {/* </div> */}

                                            {/* Error message below */}
                                            {/* {errors?.profile_image && (
                                                <p className="text-danger pt-1">{errors.profile_image.message}</p>
                                            )}
                                        </div>
                                    </div>
                            </div>
                        </div> */}
                                            {/* </div> */}

                                            {/* <div className="mb-2">
                                                <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">Name<spna className="text-danger"> *</spna></label>
                                                <div className="input-group border rounded-1">
                                                    <span className="input-group-text bg-transparent px-6 border-0" id="basic-addon1"><i className="ti ti-user fs-6" /></span>
                                                    <input type="text" className="form-control border-0 ps-2 form-control " placeholder="Enter first name" onKeyPress={handelInputText} {...register(InputTypesEnum.NAME, textValidation(InputTypesEnum.FIRSTNAME))} />
                                                </div>
                                                <label className="errorc ps-1 pt-1" >{errors[InputTypesEnum.NAME]?.message}</label>
                                            </div> */}

                                            <div className="mb-2">
                                                <label htmlFor="lastname" className="form-label fw-semibold">
                                                    Name<span className="text-danger ms-1">*</span>
                                                </label>
                                                <div className="input-group border rounded-1">
                                                    <input
                                                        type="text"
                                                        className="form-control ps-2"
                                                        placeholder="Enter name"
                                                        // autoComplete='nope'
                                                        {...register(InputTypesEnum.NAME, textValidation(InputTypesEnum.FIRSTNAME))}
                                                    />
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[InputTypesEnum.NAME]?.message}
                                                </label>
                                            </div>
                                            {/* <div className="mb-2">
                                                <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">Email<spna className="text-danger"> *</spna></label>
                                                <div className="input-group border rounded-1">
                                                    <span className="input-group-text bg-transparent px-6 border-0" id="basic-addon1"><i className="ti ti-mail fs-6" /></span>
                                                    <input type="text" className="form-control border-0 ps-2" placeholder="Enter your email address" onChange={handelInputText} {...register(InputTypesEnum.EMAIL, textValidation(InputTypesEnum.EMAIL))} />
                                                </div>
                                                <label className="errorc ps-1 pt-1" >{errors[InputTypesEnum.EMAIL]?.message}</label>
                                            </div> */}

                                            <div className="mb-2">
                                                <label htmlFor="lastname" className="form-label fw-semibold">
                                                    Email<span className="text-danger ms-1">*</span>
                                                </label>
                                                <div className="input-group border rounded-1">
                                                    <input
                                                        type="text"
                                                        className="form-control ps-2"
                                                        placeholder="Enter email"
                                                        autoComplete='nope'
                                                        {...register(InputTypesEnum.EMAIL, textValidation(InputTypesEnum.EMAIL))}
                                                    />
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[InputTypesEnum.EMAIL]?.message}
                                                </label>
                                            </div>

                                            <div className="mb-2">
                                                <label htmlFor="lastname" className="form-label fw-semibold">
                                                    Mobile Number<span className="text-danger ms-1">*</span>
                                                </label>
                                                <div className="input-group border rounded-1">
                                                    <input
                                                        type="number"
                                                        className="form-control ps-2"
                                                        placeholder="Enter mobile number"
                                                        autoComplete='nope'
                                                        {...register(InputTypesEnum.MOBILE, textValidation(InputTypesEnum.MOBILE))}
                                                    />
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[InputTypesEnum.MOBILE]?.message}
                                                </label>
                                            </div>

                                            <div className="mb-2">
                                                <label htmlFor="dob1" className="form-label fw-semibold">
                                                    Birth Date <span className="text-danger ms-1">*</span>
                                                </label>
                                                <Controller
                                                    name={InputTypesEnum.DATE}
                                                    control={control}
                                                    rules={{ required: "Date is required" }}
                                                    render={({ field }) => (
                                                        <DatePicker
                                                            id={InputTypesEnum.DATE}
                                                            picker="date"
                                                            className="form-control custom-datepicker w-100"
                                                            format={DateFormat?.DATE_FORMAT}
                                                            value={field.value ? dayjs(field.value, DateFormat?.DATE_FORMAT) : dayjs()}
                                                            onChange={(date) =>
                                                                field.onChange(
                                                                    date
                                                                        ? dayjs(date).format(DateFormat?.DATE_FORMAT)
                                                                        : dayjs()
                                                                )
                                                            }
                                                        />
                                                    )}
                                                />
                                                {errors[InputTypesEnum.DATE] && (
                                                    <small className="text-danger">
                                                        {errors[InputTypesEnum.DATE].message}
                                                    </small>
                                                )}
                                            </div>

                                            <div className="modal-footer justify-content-center">
                                                <button type='button' className="btn btn-danger" onClick={() => { setProfileModel(false) }}>Cancel</button>
                                                <button type='submit' className="btn btn-primary" >Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </form >
                            </div >
                        </div >
                    </div >
                </div >
                {
                    profileModel && (
                        <div className="modal-backdrop fade show"></div>
                    )
                }

            </div >
        </>
    )
}

export default MyProfile;
