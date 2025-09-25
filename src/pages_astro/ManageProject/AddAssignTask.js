import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import { addAssignTask, addAttendance, editAssignTask } from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import Constatnt, { AwsFolder, Codes } from '../../config/constant';
import { formatDate, formatDateDyjs, getBreakMinutes, getWorkingHours, selectOption, selectOptionCustomer, textInputValidation, } from '../../config/commonFunction';
import { AstroInputTypesEnum, DateFormat, EMPLOYEE_STATUS, InputRegex, PROJECT_LIST, PROJECT_PRIORITY, TimeFormat } from '../../config/commonVariable';
import { useDispatch, useSelector } from 'react-redux';
import { getAssignTaskListThunk, getAdminEmployeeListThunk, getProjectListThunk, setLoader } from '../../Store/slices/MasterSlice';
import Spinner from '../../component/Spinner';
import { DatePicker, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { PATHS } from '../../Router/PATHS';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";

export default function AddAssignTask() {
    const navigation = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    var AsiignTaskData = location?.state;

    const { projectList: { data: projectList } } = useSelector((state) => state.masterslice);
    const { adminEmployeeList: { data: adminEmployeeList }, } = useSelector((state) => state.masterslice);

    const [is_loding, setIs_loading] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, trigger, formState: { errors }, } = useForm({
        defaultValues: {
            breaks: [{ start: null, end: null }], // ✅ at least one row
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "breaks",
    });

    useEffect(() => {
        if (projectList?.length === 0) {
            dispatch(getProjectListThunk({}));
        }
    }, []);

    useEffect(() => {
        const request = {
            emp_leave_company: EMPLOYEE_STATUS[0]?.key
        };
        if (adminEmployeeList?.length === 0) {
            dispatch(getAdminEmployeeListThunk(request));
        }
    }, [])

    useEffect(() => {
        if (AsiignTaskData && adminEmployeeList?.length > 0) {
            dispatch(setLoader(true))
            const teamArray = AsiignTaskData?.assign_to ? AsiignTaskData?.assign_to?.split(",").map(Number) : [];
            setValue(AstroInputTypesEnum.EMPLOYEE, teamArray || []);
            setValue(AstroInputTypesEnum.PROJECT, AsiignTaskData?.project_id || null);
            setValue(AstroInputTypesEnum.NAME, AsiignTaskData?.title || null);
            setValue(AstroInputTypesEnum.DESCRIPTION, AsiignTaskData?.description || null);
            setValue(AstroInputTypesEnum.PRIORITY, AsiignTaskData?.priority || null);
            setValue(AstroInputTypesEnum.DATE, AsiignTaskData?.due_date ? dayjs(AsiignTaskData?.due_date, 'YYYY-MM-DD') : null);

            dispatch(setLoader(false))
        }
    }, [AsiignTaskData, adminEmployeeList]);

    const onSubmitData = async (data) => {
        try {
            dispatch(setLoader(true))
            let request = {
                project_id: data[AstroInputTypesEnum.PROJECT],
                title: data[AstroInputTypesEnum.NAME],
                description: data[AstroInputTypesEnum.DESCRIPTION],
                due_date: formatDateDyjs(data[AstroInputTypesEnum.DATE], DateFormat?.DATE_DASH_TIME_FORMAT),
                assign_to: data[AstroInputTypesEnum.EMPLOYEE]?.length == 1 ? data[AstroInputTypesEnum.EMPLOYEE][0]?.toString() : data[AstroInputTypesEnum.EMPLOYEE],
                priority: data[AstroInputTypesEnum.PRIORITY],
                status : ""
            };
            if (AsiignTaskData) {
                request.task_id = AsiignTaskData?.id?.toString();
                editAssignTask(request).then((response) => {
                    if (response?.code == Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigation(PATHS?.LIST_ASSIGN_TASK)
                        dispatch(getAssignTaskListThunk({}));
                        dispatch(setLoader(false))
                    } else {
                        TOAST_ERROR(response.message)
                        dispatch(setLoader(false))
                    }
                })
            } else {
                addAssignTask(request).then((response) => {
                    if (response?.code == Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigation(PATHS?.LIST_ASSIGN_TASK)
                        dispatch(getAssignTaskListThunk({}));
                        dispatch(setLoader(false))
                    } else {
                        TOAST_ERROR(response.message)
                        dispatch(setLoader(false))
                    }
                })
            }
        } catch (error) {
            TOAST_ERROR('Somthing went wrong')
            dispatch(setLoader(false))
        }
    }

    const handleInputChange = async (key, value) => {
        let filteredValue = value;
        if (key === AstroInputTypesEnum.PANCARD) {
            filteredValue = value.replace(InputRegex.ONCHANGE_PANNUMBER_REGEX, '');
        } else if (key === AstroInputTypesEnum.ADHARCARD) {
            filteredValue = value.replace(InputRegex.ONCHANGE_AADHAR_REGEX, '');
        } else if (key === AstroInputTypesEnum.MOBILE || key === AstroInputTypesEnum.MONTHLY_SALARY) {
            filteredValue = value.replace(InputRegex.ONCHANGE_MOBILE_REGEX, '');
        }
        setValue(key, filteredValue)
        clearErrors(key);               // Clear error message (if any)
        await trigger(key);
    };

    const handleChange = value => {
        console.log(`selected ${value}`);
    };

    return (
        <>
            {<Spinner isActive={is_loding} message={'Please Wait'} />}
            <div className="container-fluid mw-100">
                <SubNavbar title={AsiignTaskData ? 'Edit Assign Task' : 'Add Assign Task'} header={'Assign Task List'} subHeaderOnlyView={AsiignTaskData ? 'Edit Assign Task' : 'Add Assign Task'} />
                <div className="row">
                    <div className="col-12 justify-content-center">
                        <div className='row justify-content-center '>
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="card" >
                                    <div className="card-body">

                                        <div className='row col-12 col-md-12 '>
                                            <div className='col-md-6'>
                                                <div className="mb-4">

                                                    <label htmlFor="gender1" className="form-label fw-semibold">
                                                        Select Project<span className="text-danger ms-1">*</span>
                                                    </label>

                                                    <Controller
                                                        name={AstroInputTypesEnum.PROJECT}
                                                        control={control}
                                                        rules={{ required: "Select at least one project" }}
                                                        render={({ field }) => (
                                                            <Select
                                                                // mode="multiple"
                                                                style={{ width: "100%", height: "40px" }}
                                                                placeholder="Select project"
                                                                value={field.value || []}
                                                                onChange={(selectedIds) => {
                                                                    field.onChange(selectedIds);
                                                                    setValue(AstroInputTypesEnum.PROJECT, selectedIds);
                                                                }}
                                                                options={projectList?.map((c) => ({
                                                                    label: c.name,
                                                                    value: c.id,
                                                                })) || []}
                                                                optionRender={(option) => (
                                                                    <Space>{option?.label}</Space>
                                                                )}
                                                                className='border rounded-1'
                                                            />
                                                        )}
                                                    />
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.PROJECT]?.message}
                                                    </label>
                                                </div>

                                                <div className="2 d-flex gap-2">
                                                    <div className="col-12 col-md-6">

                                                        <label htmlFor="dob1" className="form-label fw-semibold">
                                                            Deadline Date<span className="text-danger ms-1">*</span>
                                                        </label>
                                                        <Controller
                                                            name={AstroInputTypesEnum.DATE}
                                                            control={control}
                                                            rules={{ required: "Select Deadline Date" }}
                                                            render={({ field }) => (
                                                                <DatePicker
                                                                    id={AstroInputTypesEnum.DATE}
                                                                    className="form-control custom-datepicker w-100"
                                                                    format={DateFormat?.DATE_FORMAT}
                                                                    value={field.value ? dayjs(field.value) : null}
                                                                    onChange={(date) => field.onChange(date ? date.toISOString() : null)}
                                                                    allowClear={false}
                                                                    picker="date"
                                                                />
                                                            )}
                                                            className='border rounded-1'
                                                        />
                                                        {errors[AstroInputTypesEnum.DATE] && (
                                                            <small className="text-danger">{errors[AstroInputTypesEnum.DATE].message}</small>
                                                        )}
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-4">
                                                            <label htmlFor="priority" className="form-label fw-semibold">
                                                                Priority<span className="text-danger ms-1">*</span>
                                                            </label>
                                                            <div className="input-group">
                                                                <Controller
                                                                    name={AstroInputTypesEnum.PRIORITY}
                                                                    control={control}
                                                                    rules={{ required: "Select priority" }}
                                                                    render={({ field }) => (
                                                                        <Select
                                                                            style={{ width: "100%", height: "40px" }}
                                                                            placeholder="Select priority"
                                                                            value={field.value || undefined} // single value
                                                                            onChange={(selectedId) => {
                                                                                field.onChange(selectedId); // update form
                                                                                setValue(AstroInputTypesEnum.PRIORITY, selectedId); // optional extra
                                                                            }}
                                                                            options={PROJECT_PRIORITY?.map((c) => ({
                                                                                label: c.value,
                                                                                value: c.key,
                                                                            })) || []
                                                                            }
                                                                            // optionFilterProp="label"
                                                                            // filterSort={(optionA, optionB) =>
                                                                            //     (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                                                            // }
                                                                            optionRender={(option) => <Space>{option?.label}</Space>}
                                                                            className='border rounded-1'
                                                                        />
                                                                    )}
                                                                />
                                                            </div>
                                                            <label className="errorc ps-1 pt-1">
                                                                {errors[AstroInputTypesEnum.PRIORITY]?.message}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <label
                                                        htmlFor="leave_reason"
                                                        className="form-label fw-semibold"
                                                    >
                                                        Task Description <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className=" border rounded-1">
                                                        <Controller
                                                            name={AstroInputTypesEnum.DESCRIPTION}
                                                            control={control}
                                                            rules={{ required: "Enter task description" }}
                                                            render={({ field }) => (
                                                                <ReactQuill
                                                                    {...field}
                                                                    theme="snow"
                                                                    placeholder="Enter task description"
                                                                    className="custom-quill w-100"
                                                                    style={{ minHeight: "200px" }} // ~4 lines
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.DESCRIPTION]?.message}
                                                    </label>
                                                </div>


                                            </div>

                                            <div className='col-md-6'>
                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Task Name <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter project name"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.NAME, textInputValidation(AstroInputTypesEnum.NAME, 'Enter project name'))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.NAME]?.message}
                                                    </label>
                                                </div>


                                                <div className="mb-4">

                                                    <label htmlFor="gender1" className="form-label fw-semibold">
                                                        Select Employee<span className="text-danger ms-1">*</span>
                                                    </label>

                                                    <Controller
                                                        name={AstroInputTypesEnum.EMPLOYEE}
                                                        control={control}
                                                        rules={{ required: "Select at least one employee" }}
                                                        render={({ field }) => (
                                                            <Select
                                                                mode="multiple"
                                                                style={{ width: "100%", height: "40px" }}
                                                                placeholder="Select employee"
                                                                value={field.value || []} // ensure controlled array
                                                                onChange={(selectedIds) => {
                                                                    field.onChange(selectedIds); // updates form value
                                                                    setValue(AstroInputTypesEnum.EMPLOYEE, selectedIds); // optional extra update
                                                                }}
                                                                options={adminEmployeeList?.map((c) => ({
                                                                    label: c.name,
                                                                    value: c.id,
                                                                })) || []}
                                                                optionRender={(option) => (
                                                                    <Space>{option?.label}</Space>
                                                                )}
                                                                className='border rounded-1'
                                                            />
                                                        )}
                                                    />

                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.EMPLOYEE]?.message}
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="modal-footer justify-content-center mb-3">
                                                <button type='submit' className="btn btn-primary" >Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>

            </div >
        </>
    )
}
