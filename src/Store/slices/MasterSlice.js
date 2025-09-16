import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from '../../utils/api.services';

// ----------------------------------------------------------- TRACEWAVE Slice -------------------------------------------------------

export const getUserDetailsThunk = createAsyncThunk("UserDetailsList", async (submitData, { dispatch }) => {
    try {
        dispatch(setLoader(true))
        const { data } = await API.employeeGetDetails(submitData);
        dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getDailyTaskListThunk = createAsyncThunk("DailyTaskList", async (submitData, { dispatch }) => {
    try {
        dispatch(setLoader(true))
        const { data } = await API.DailyTaskList(submitData);
        dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getlistAttendanceThunk = createAsyncThunk("listAttendance", async (submitData, { dispatch }) => {
    try {
        dispatch(setLoader(true))
        const { data } = await API.listAttendance(submitData);
        dispatch(setLoader(false))
        return data?.length > 0 ? data : [];
    } catch (error) {
        throw error;
    }
});

export const getAllLoanListThunk = createAsyncThunk("allLoanList", async (submitData, { dispatch }) => {
    try {
        // dispatch(setLoader(true))
        const { data } = await API.listAllLoan(submitData);
        // dispatch(setLoader(false))

        const updatedData = {
            ...data,
            loan_applications: data?.loan_applications?.map(app => ({
                ...app,
                cibil_score: app?.credit_score, // or any dynamic value you want to add
            }))
        };
        return updatedData;
    } catch (error) {
        throw error;
    }
});

export const getlistLeavesThunk = createAsyncThunk("listLeaves", async (submitData, { dispatch }) => {
    try {
        dispatch(setLoader(true))
        const { data } = await API.listLeaves(submitData);
        dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getEmpLeaveBalanceListThunk = createAsyncThunk("empLeaveBalanceList", async (submitData, { dispatch }) => {
    try {
        dispatch(setLoader(true))
        const { data } = await API.listEmpLeaveBalance(submitData);
        dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getListBankDetailsThunk = createAsyncThunk("listBankDetails", async (submitData, { dispatch }) => {
    try {
        dispatch(setLoader(true))
        const { data } = await API.listBankDetails(submitData);
        dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getListDepartnmentThunk = createAsyncThunk("ListDepartnment", async (submitData, { dispatch }) => {
    try {
        // dispatch(setLoader(true))
        const { data } = await API.departnmentList(submitData);
        // dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getSaturdayListThunk = createAsyncThunk("SaturdayList", async (submitData, { dispatch }) => {
    try {
        dispatch(setLoader(true))
        const { data } = await API.saturdayList(submitData);
        dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getSalaryListThunk = createAsyncThunk("SalaryList", async (submitData, { dispatch, rejectWithValue }) => {
    try {
        dispatch(setLoader(true));
        submitData.action = "employee"
        const { data } = await API.listSalary(submitData);
        return data?.results[0];
    } catch (error) {
        // Forward error to extraReducers for proper error handling
        // return rejectWithValue(error.response?.data || error.message);
    } finally {
        // Always stop loader
        dispatch(setLoader(false));
    }
}
);

export const getAdminEmployeeListThunk = createAsyncThunk("AdminEmployeeList", async (submitData, { dispatch, rejectWithValue }) => {
    try {
        dispatch(setLoader(true));
        submitData.emp_leave_company = "0"
        const { data } = await API.AdminEmployeeList(submitData);
        return data;
    } catch (error) {
        // Forward error to extraReducers for proper error handling
        // return rejectWithValue(error.response?.data || error.message);
        console.log(error);

    } finally {
        // Always stop loader
        dispatch(setLoader(false));
    }
}
);

export const getListContactUsThunk = createAsyncThunk("listContactUs", async (submitData, { dispatch }) => {
    try {
        // dispatch(setLoader(true))
        const { data } = await API.listContactUs(submitData);
        // dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getProcessingFeeListThunk = createAsyncThunk("ProcessingFee", async (submitData, { dispatch }) => {
    try {
        // dispatch(setLoader(true))
        const { data } = await API.processingFeeList(submitData);
        // dispatch(setLoader(false))
        return data?.processing_fees;
    } catch (error) {
        throw error;
    }
});

export const getHolidayListThunk = createAsyncThunk("HolidayList", async (submitData, { dispatch }) => {
    try {
        dispatch(setLoader(true))
        const { data } = await API.listHolidays(submitData);
        dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getEMIChargeListThunk = createAsyncThunk("listEMICharge", async (submitData, { dispatch }) => {
    try {
        // dispatch(setLoader(true))
        const { data } = await API.listEMICharge(submitData);
        // dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

const initialState = {
    isLoading: false,
    userDetails: {
        data: [],
        error: null,
    },
    dailyTaskList: {
        data: [],
        error: null,
    },
    holidayList: {
        data: [],
        error: null,
    },
    leaveList: {
        data: [],
        error: null,
    },
    empLeaveBalanceList: {
        data: [],
        error: null,
    },
    attendanceList: {
        data: [],
        error: null,
    }, salaryList: {
        data: [],
        error: null,
    },
    bankDetailsList: {
        data: [],
        error: null,
    },
    departnmentList: {
        data: [],
        error: null,
    },
    saturdayList: {
        data: [],
        error: null,
    },
    adminEmployeeList: {
        data: [],
        error: null,
    },






    listAllLoan: {
        data: [],
        error: null,
    },
    listProcessFee: {
        data: [],
        error: null,
    },
    customModel: {
        isOpen: false,
        modalType: ''
    },
    contactUsList: {
        data: [],
        error: null,
    },

    emiChargesList: {
        data: [],
        error: null,
    },
    slidebarToggle: true,
    pageScroll: false
}

const masterSlice = createSlice({
    name: 'masterslice',
    initialState,
    reducers: {
        setLoader: (state, action) => {
            state.isLoading = action.payload;
        },
        updateSlidebarToggle: (state, action) => {
            console.log('acton payload slidebar', action.payload);

            state.slidebarToggle = action.payload;
        },
        setModalStatus: (state, action) => {
            const { modalType, isOpen, data } = action.payload;
            state.customModel.modalType = modalType;
            state.customModel.isOpen = isOpen;
        },


        // ---------------------- Loan -----------------------------

        updateLoanList: (state, action) => {
            state.listAllLoan.data = action.payload;
        },

        updateIntrestList: (state, action) => {
            state.salaryList.data = action.payload;
        },
        updateDailyTaskList: (state, action) => {
            state.dailyTaskList.data = action.payload;
        },
        updateAttendanceList: (state, action) => {
            state.attendanceList.data = action.payload;
        },

        updateProcessingFeeList: (state, action) => {
            state.salaryList.data = action.payload;
        },
        updateHolidayList: (state, action) => {
            state.holidayList.data = action.payload;
        },
        updateLeaveList: (state, action) => {
            state.leaveList.data = action.payload;
        },
        updateLeaveBalanceList: (state, action) => {
            state.empLeaveBalanceList.data = action.payload;
        },
        updateBankDetailsList: (state, action) => {
            state.empLeaveBalanceList.data = action.payload;
        },
        updateDepartnmentList: (state, action) => {
            state.departnmentList.data = action.payload;
        },
        updateSaterdayList: (state, action) => {
            state.saturdayList.data = action.payload;
        },

        updateEMICahrgeList: (state, action) => {
            state.emiChargesList.data = action.payload;
        },

        // ------------------ Astro --------------------

        updateCategoryList: (state, action) => {
            state.categoryList.data = action.payload;
        },
        updateFilterCategoryList: (state, action) => {
            state.filterCategoryList.data = action.payload;
        },
        updateCouponCodeList: (state, action) => {
            state.couponCodeList.data = action.payload;
        },

        updateBlogList: (state, action) => {
            state.blogList.data = action.payload;
        },

        updateBannerList: (state, action) => {
            state.bannerList.data = action.payload;
        },
        updateCelebrityList: (state, action) => {
            state.celebrityList.data = action.payload;
        },
        updateNewsList: (state, action) => {
            state.newsList.data = action.payload;
        },
        updateNewsLatterList: (state, action) => {
            state.newsLatterList.data = action.payload;
        },
        updateWalletOfferList: (state, action) => {
            state.walletOfferList.data = action.payload;
        },
        updateContactUsList: (state, action) => {
            state.contactUsList.data = action.payload;
        },
        updatePageScroll: (state, action) => {
            state.pageScroll = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getUserDetailsThunk.fulfilled, (state, action) => {
                state.userDetails.data = action.payload;
            })
            .addCase(getUserDetailsThunk.rejected, (state, action) => {
                state.userDetails.error = action.error.message;
            })

            .addCase(getDailyTaskListThunk.fulfilled, (state, action) => {
                state.dailyTaskList.data = action.payload;
            })
            .addCase(getDailyTaskListThunk.rejected, (state, action) => {
                state.dailyTaskList.error = action.error.message;
            })



            .addCase(getAllLoanListThunk.fulfilled, (state, action) => {
                state.listAllLoan.data = action.payload;
            })
            .addCase(getAllLoanListThunk.rejected, (state, action) => {
                state.listAllLoan.error = action.error.message;
            })

            .addCase(getlistLeavesThunk.fulfilled, (state, action) => {
                state.leaveList.data = action.payload;
            })
            .addCase(getlistLeavesThunk.rejected, (state, action) => {
                state.leaveList.error = action.error.message;
            })

            .addCase(getEmpLeaveBalanceListThunk.fulfilled, (state, action) => {
                state.empLeaveBalanceList.data = action.payload;
            })
            .addCase(getEmpLeaveBalanceListThunk.rejected, (state, action) => {
                state.empLeaveBalanceList.error = action.error.message;
            })

            .addCase(getListBankDetailsThunk.fulfilled, (state, action) => {
                state.bankDetailsList.data = action.payload;
            })
            .addCase(getListBankDetailsThunk.rejected, (state, action) => {
                state.bankDetailsList.error = action.error.message;
            })

            .addCase(getListDepartnmentThunk.fulfilled, (state, action) => {
                state.departnmentList.data = action.payload;
            })
            .addCase(getListDepartnmentThunk.rejected, (state, action) => {
                state.departnmentList.error = action.error.message;
            })


            .addCase(getSaturdayListThunk.fulfilled, (state, action) => {
                state.saturdayList.data = action.payload;
            })
            .addCase(getSaturdayListThunk.rejected, (state, action) => {
                state.saturdayList.error = action.error.message;
            })


            .addCase(getlistAttendanceThunk.fulfilled, (state, action) => {
                state.attendanceList.data = action.payload || [];
            })
            .addCase(getlistAttendanceThunk.rejected, (state, action) => {
                state.attendanceList.error = action.error.message;
            })

            .addCase(getSalaryListThunk.fulfilled, (state, action) => {
                state.salaryList.data = action.payload;
            })
            .addCase(getSalaryListThunk.rejected, (state, action) => {
                state.salaryList.error = action.error.message;
            })

            .addCase(getHolidayListThunk.fulfilled, (state, action) => {
                state.holidayList.data = action.payload;
            }).addCase(getHolidayListThunk.rejected, (state, action) => {
                state.holidayList.error = action.error.message;
            })

            .addCase(getAdminEmployeeListThunk.fulfilled, (state, action) => {
                state.adminEmployeeList.data = action.payload;
            }).addCase(getAdminEmployeeListThunk.rejected, (state, action) => {
                state.adminEmployeeList.error = action.error.message;
            })
    },
});

export const { setLoader, setModalStatus, updatePostList, updateCategoryList, updateAttendanceList, updateSaterdayList, updateDepartnmentList, updateLeaveBalanceList, updateBankDetailsList, updateEMICahrgeList, updateHolidayList, updateSlidebarToggle, updateLeaveList, updateCouponCodeList, updateIntrestList, updateBlogList, updateDailyTaskList, updateBannerList, updateCelebrityList, updateLoanList, updateNewsList, updateFilterCategoryList, updateWalletOfferList, updateContactUsList, updateNewsLatterList, updatePageScroll, updateProcessingFeeList } = masterSlice.actions;
export default masterSlice.reducer;