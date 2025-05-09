import { useEffect, useState } from "react";
import { Images } from "../constants.astro";
import { getUser } from "../store";
import { Button } from "./utility/Button";
import { ReportsAPIs } from "../APIs/reports/reportsAPI";
import { Loader } from "./utility/Loader";
import { confirmBox, ShowAlert } from "./alertLogic";


export const Complain = ({ ...props }) => {
    const [complain, setComplain] = useState(null);
    const [isOwner, setOwner] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [loadingComplaintId, setLoadingComplaintId] = useState(null); // Track the complaint being updated

    useEffect(() => {
        (function () {
            const user = getUser();
            if (user._id == props.complain.userID && !props.complain.userDetails) {
                setOwner(true);
                props.complain.userDetails = user;
            }
            setComplain(props.complain);
        })();
    }, [])


    const chnageStatus = async (id) => {
        let confirmed = await confirmBox("Sure want to Close complaint?");
        if (!confirmed) return;

        setLoadingComplaintId(id); // Set the ID of the complaint being updated

        try {
            const res = await ReportsAPIs('/changeStatus', { id });
            if (res?.success) {
                setComplain((prevComplain) => ({
                    ...prevComplain,
                    isOpen: !prevComplain.isOpen, // Toggle the status
                }));
                ShowAlert('Complaint Closed', true);
            } else {
                ShowAlert('Failed to update complaint status', false);
            }
        } catch (error) {
            console.error("Error updating complaint status:", error);
            ShowAlert('An error occurred while updating the complaint status', false);
        } finally {
            setLoadingComplaintId(null); // Reset the loading state
        }
    };

    return (
        complain &&
        <div className="bg-white p-4 tablet:py-3 tablet:px-2 min-h-fit flex flex-col gap-2 shadow rounded-lg border border-gray-200">
            <div key={complain._id} className=" flex items-center gap-2 ">
                <img
                    src={Images.userIcon}
                    alt="User"
                    // className={`w-12 h-12 rounded-full border-[1px] ${!complain?.isOpen ? 'border-red-500' : 'border-green-500'} `}
                    className={`w-12 h-12 rounded-full border-[1px] border-blue-500 `}
                />
                <a href={`/dashboard/reports/report/id?id=${complain._id}`} className="flex-1 overflow-hidden">
                    <div className="flex gap-2 tablet:gap-1 flex-wrap items-center justify-between">
                        <h3 className="text-lg font-semibold">{complain.userDetails.username}</h3>
                        <p className="text-xs text-gray-400">{new Date(complain.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-row relative items-center gap-1">
                        <p className="text-gray-600 font-medium text-nowrap truncate overflow-hidden">{complain.title}</p>
                    </div>
                    <p className="text-gray-500 text-sm truncate overflow-hidden">{complain.description}</p>
                </a>
                <a className="tablet:hidden" href={`/dashboard/reports/report/id?id=${complain._id}`} title="Reply">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/481/481675.png"
                        alt="Reply Icon"
                        className="w-6 h-6"
                    />
                </a>
            </div >
            {(isOwner && complain.isOpen) &&
                <div className="w-full flex flex-col justify-end gap-1">
                    <hr className="w-full my-2" />
                    <div className="flex justify-end gap-1">
                        <div>
                            <Button
                                onClick={() => chnageStatus(complain._id)}
                                type="submit"
                                disabled={loadingComplaintId === complain._id} // Disable only the button for the complaint being updated
                            >
                                {loadingComplaintId === complain._id ? (
                                    <Loader />
                                ) : (
                                    complain.isOpen ? 'Close Complaint' : 'Set Open'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}