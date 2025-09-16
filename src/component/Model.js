import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PUBLIC_URL } from '../config/constant'
import { useDispatch, useSelector } from 'react-redux';
import { closeModel } from '../config/commonFunction';
import { ModelName } from '../config/commonVariable';

const Model = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()
    const { customModel: { isOpen, modalType } } = useSelector((state) => state.masterslice);

    return (
        <div>
            <div
                className={`modal custom_model ${isOpen ? 'fade show d-flex align-items-center justify-content-center' : 'd-none'}`}
                id="delete-account"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <form>
                    <div className={ModelName.DELETE_MODEL === modalType || ModelName.LOGOUT_MODEL === modalType ? "modal-dialog  modal-lg modal-dialog-centered" : "modal-dialog modal-lg modal-dialog-centered"}>
                        <div className={ModelName.DELETE_MODEL === modalType || ModelName.LOGOUT_MODEL === modalType ? "modal-content modal-filled bg-light-danger" : "modal-content"}>

                            {/* {
                                ModelName.DELETE_MODEL !== modalType && (<> */}
                            <div className="modal-content border-0">
                                <div className="modal-header d-flex align-items-center">
                                    <h4 className="modal-title" id="myLargeModalLabel">
                                        {/* Post Title */}
                                    </h4>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => { closeModel(dispatch) }}
                                    />
                                </div>
                                {/* </>)
                            } */}

                                <div className="modal-body">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {isOpen && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default Model
