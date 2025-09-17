import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import SubNavbar from '../../layout/SubNavbar';
import { addHolidays, deleteHolidays, updateHolidays } from '../../utils/api.services';
import { ExportToCSV, ExportToExcel, ExportToPdf, SWIT_DELETE, SWIT_DELETE_SUCCESS, TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import profile_image from '../../assets/Images/default.jpg'
import ReactDatatable from '../../config/ReactDatatable';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getHolidayListThunk, getSalaryListThunk, setLoader, updateDailyTaskList, updateHolidayList, updateIntrestList } from '../../Store/slices/MasterSlice';
import Constatnt, { Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, disableFutureDates, formatDate, formatDateDyjs, openModel, textInputValidation } from '../../config/commonFunction';
import Model from '../../component/Model';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import Pagination from '../../component/Pagination';
import { AstroInputTypesEnum, DateFormat, LOAN_TYPES } from '../../config/commonVariable';
import { IoAddCircleOutline } from 'react-icons/io5';
import { useForm } from 'react-hook-form';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { PATHS } from '../../Router/PATHS';
import { FaCalendarAlt, FaFlag, FaHeart } from 'react-icons/fa';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Calendar } from "react-bootstrap-icons";
import { CiCalendarDate } from 'react-icons/ci';
import { GoDotFill } from "react-icons/go";

export default function Holidays() {

    let navigat = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, formState: { errors } } = useForm();
    const { holidayList: { data: listHoliday }, } = useSelector((state) => state.masterslice);
    const { customModel } = useSelector((state) => state.masterslice);

    const [selectedUser, setSelectedUser] = useState()
    const dateFormat = "YYYY";
    const [startDate, setStartDate] = useState(dayjs());

    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const debounce = useDebounce(globalFilterValue, SEARCH_DELAY);
    const [filters, setFilters] = useState({ global: { value: '' } });
    const [sortField, setSortField] = useState('created_at');
    const [sortOrder, setSortOrder] = useState(-1);
    const [perPage, setPerPage] = useState(50);
    const [page, setPage] = useState(1);

    const [scheduleModel, setScheduleModel] = useState(false);
    const [holidayDate, setHolidayDate] = useState(null);
    const [is_edit, setIs_Edit] = useState(false);
    const [is_add, setIs_Add] = useState(false);
    const [editData, setEditData] = useState({});

    const fetchData = async () => {
        const request = {
            year: startDate ? formatDateDyjs(startDate, DateFormat?.DATE_WEEK_NAME_FORMAT_YEAR) : null,
        }
        await dispatch(getHolidayListThunk(request));
    };

    useEffect(() => {
        if (listHoliday?.length === 0) {
            fetchData();
        }
    }, []);

    const closeModelFunc = async () => {
        setScheduleModel(false);
        setIs_Edit(false);
        setIs_Add(false);
        setEditData({});
        setHolidayDate(dayjs());
        reset();
    }

    const handleDelete = (is_true) => {
        if (is_true) {
            dispatch(setLoader(true));
            let submitData = {
                holiday_id: selectedUser?.id,
                is_deleted: 0,
            };
            deleteHolidays(submitData).then((response) => {
                if (response.code == Codes?.SUCCESS) {
                    closeModel(dispatch);

                    const updatedList = listHoliday?.filter(
                        (item) => item.id !== selectedUser?.id
                    );

                    dispatch(updateHolidayList(updatedList));
                    setSelectedUser(null);
                    dispatch(setLoader(false));
                    TOAST_SUCCESS(response?.message);
                } else {
                    closeModel(dispatch);
                    TOAST_ERROR(response?.message);
                    dispatch(setLoader(false));
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

    const onPageChange = (Data) => {
        setPage(Data)
    }

    const handleSort = (event) => {
        console.log("Sort event triggered:", event);
        setSortField(event.sortField); // ✅ correct key
        setSortOrder(event.sortOrder);
    };

    const onSubmitData = async (data) => {
        try {
            let request = {
                name: data[AstroInputTypesEnum.NAME],
                date: formatDateDyjs(holidayDate, DateFormat.DATE_DASH_TIME_FORMAT),
            }
            dispatch(setLoader(true))
            if (is_edit) {
                request.holiday_id = editData.id;
                updateHolidays(request).then((response) => {
                    if (response?.code == Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigat(PATHS?.HOLIDAYS_LIST)
                        setIs_Edit(false)
                        setScheduleModel(false)
                        setHolidayDate(dayjs())
                        setEditData({})
                        closeModelFunc()
                        dispatch(setLoader(false))
                        reset()
                    } else {
                        setIs_Edit(false)
                        setScheduleModel(false)
                        TOAST_ERROR(response.message)
                        reset()
                        dispatch(setLoader(false))
                        closeModelFunc()
                    }
                })
            } else {
                addHolidays(request).then((response) => {
                    if (response?.code == Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigat(PATHS?.HOLIDAYS_LIST)
                        setScheduleModel(false)
                        setHolidayDate(dayjs())
                        closeModelFunc();
                        setIs_Add(false)
                        dispatch(setLoader(false))

                    } else {
                        setIs_Edit(false)
                        setIs_Add(false)
                        setScheduleModel(false)
                        closeModelFunc();
                        TOAST_ERROR(response.message)
                        dispatch(setLoader(false))
                    }
                })
            }
        } catch (error) {
            dispatch(setLoader(false))
            TOAST_ERROR('Somthing went wrong')
        }
    }

    const editFunction = async (data) => {
        setValue(AstroInputTypesEnum.NAME, data?.name)
        setHolidayDate(data?.date ? dayjs(data?.date) : null)
        setIs_Edit(true)
        setScheduleModel(true)
        setEditData(data)
    }

    const FestivalCard = ({ festival }) => {
        return (
            <Col xs={12} sm={12} md={6} lg={4} className="mb-4">
                <Card
                    className={`shadow-sm h-100 rounded-3 border-0 ${festival?.is_upcoming ? 'green_border' : 'red_border'}`}
                    style={{
                        // background: "#1f749417", 
                        // border : '2px solid #FF6B6B ',
                    }}
                >
                    <Card.Body className="d-flex flex-column justify-content-center align-items-start p-4">

                        {/* Festival Name */}
                        <h4
                            className="fw-semibold mb-3 text-truncate 
                                   fs-5 fs-md-4 fs-lg-3"
                            style={{ color: "#1f7494", maxWidth: "100%" }}
                        >
                            <GoDotFill className="me-1" size={20} /> {festival.name}
                        </h4>

                        {/* Festival Date */}
                        <div
                            className="d-flex align-items-center 
                                   fs-6 fs-md-5 fs-lg-5 fw-semibold"
                            style={{ color: "#555" }}
                        >
                            <CiCalendarDate
                                className="me-2"
                                size={22}
                                style={{ color: "#1f7494" }}
                            />
                            {formatDateDyjs(festival.date, DateFormat?.DATE_WEEK_MONTH_NAME_FORMAT_WEEK)}
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        );
    };

    const onChangeApiCalling = (data) => {
        const request = {
            year: data?.date ? formatDateDyjs(data.date, DateFormat?.DATE_WEEK_NAME_FORMAT_YEAR) : null,
        };
        dispatch(getHolidayListThunk(request));
    };

    return (
        <>
            <div className="container-fluid mw-100">
                <SubNavbar title={"Holidays List"} header={'Holidays List'} />
                {/* <div className="widget-content searchable-container list"> */}
                <div className="card card-body">
                    <div className="table-responsive ">
                        <div className="my-2 p-4">
                            <div className="row g-3 mb-3">
                                <div className="col-12 col-md-6 col-lg-10">
                                    <h3 className="text-center text-custom-theam mt-2 fw-semibold">
                                        Upcoming Holidays – {formatDateDyjs(startDate, DateFormat?.DATE_WEEK_NAME_FORMAT_YEAR)}
                                    </h3>
                                </div>
                                <div className="col-12 col-md-6 col-lg-2">
                                    <DatePicker
                                        className="custom-datepicker w-100 p-2"
                                        picker="year"
                                        format={dateFormat}
                                        value={startDate}
                                        onChange={(date) => {
                                            setStartDate(date);
                                            onChangeApiCalling({
                                                date: date,
                                            });
                                        }}
                                        disabledDate={disableFutureDates}
                                    />
                                </div>
                            </div>
                            <hr className='mb-4' />
                            <Row >
                                {listHoliday?.length > 0 && listHoliday?.map((festival) => (
                                    <FestivalCard key={festival.id} festival={festival} />
                                ))}
                            </Row>
                        </div>
                        <div className=''>
                            <Pagination per_page={perPage} pageCount={listHoliday?.total_count} onPageChange={onPageChange} page={page} />
                        </div>
                    </div>
                </div>
                {/* </div> */}
            </div>

            <div className={`modal custom-modal  ${scheduleModel ? "fade show d-block " : "d-none"}`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-sm modal-md modal-lg" role="document">
                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary " style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h6 className="modal-title text-dark fs-5">{is_edit ? 'Edit' : 'Add'} Holidays</h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { closeModelFunc() }} />
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="col-lg-12">
                                    <div className="card-body p-4">
                                        <div className='row d-flex gap-3'>
                                            <div className='col'>
                                                <div className="mb-2">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Name <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter name"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.NAME, textInputValidation(AstroInputTypesEnum.NAME, 'Enter name'))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.NAME]?.message}
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="payment_date" className="form-label fw-semibold">
                                                    Date<span className="text-danger ms-1">*</span>
                                                </label>
                                                <div className="input-group">
                                                    <DatePicker
                                                        id={AstroInputTypesEnum.DATE}
                                                        className="paymnet-custom-datepicker w-100"
                                                        format={'YYYY-MM-DD'}
                                                        value={holidayDate}
                                                        onChange={(date) => {
                                                            setHolidayDate(date); // Store date in state
                                                        }}
                                                    />
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[AstroInputTypesEnum.DATE]?.message}
                                                </label>
                                            </div>
                                        </div>
                                        <div className="modal-footer justify-content-center">
                                            <button type="button" className="btn btn-danger" onClick={() => { closeModelFunc() }}>Cancel</button>
                                            <button type="submit" className="btn btn-primary">Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
            {
                scheduleModel && (
                    <div className="modal-backdrop fade show"></div>
                )
            }

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


