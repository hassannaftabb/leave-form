import React from "react";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import { toast } from "react-hot-toast";
import { AiFillInfoCircle } from "react-icons/ai";
import { Tooltip } from "primereact/tooltip";
require("twix");
const FirstSection = ({ formik }) => {
  //allowed leaves
  let allowedLeaves = 30;

  const calendarDatesChangeHelper = (event) => {
    //get the date range
    const allDates = moment
      .twix(moment(event.value[0]), moment(event?.value[1]))
      .toArray("days")
      .map((date) => new Date(date));
    const allDatesWithoutWeekends = allDates?.filter(
      (date) =>
        moment(date).format("ddd") !== "Sat" &&
        moment(date).format("ddd") !== "Sun"
    );
    if (allDatesWithoutWeekends.length > allowedLeaves) {
      toast.error("Leaves Limit Exceeded");
    } else {
      //start
      const startDate = event.value[0];
      //end
      const endDate = event.value[1];
      //handle change function for date range
      formik.handleChange(event);

      //A function to calcuate leave balance based on allocated dates per year and excludes weekends.
      function calculateLeaveBalanceExcludingWeekends(
        startDate,
        endDate,
        leaveDaysPerYear
      ) {
        // Calculate the number of weekdays between the start and end dates
        let currentDate = moment(startDate);
        const endDateCopy = moment(endDate);
        let numWeekdaysInRange = 0;
        while (currentDate.isSameOrBefore(endDateCopy)) {
          if (currentDate.day() !== 0 && currentDate.day() !== 6) {
            // 0 is Sunday, 6 is Saturday
            numWeekdaysInRange++;
          }
          currentDate.add(1, "days");
        }

        // Calculate the number of days of leave used in the date range
        const numLeaveDaysUsed = Math.min(numWeekdaysInRange, leaveDaysPerYear);

        // Calculate the remaining leave balance
        const leaveBalance = leaveDaysPerYear - numLeaveDaysUsed;

        return leaveBalance;
      }
      //run the function
      const leaveBalance = calculateLeaveBalanceExcludingWeekends(
        startDate,
        endDate,
        allowedLeaves
      );
      //set the value
      formik.setFieldValue("leaveBalance", leaveBalance);

      //calculate pro rated leave (hire date is static for now for all, no indication in assessment details for that.)
      function computeProRatedLeave(entitlementDaysPerYear, hireDate) {
        // Determine how many months the employee has worked this year
        const monthsWorked = moment().diff(hireDate, "months");

        // Calculate the total number of days of leave the employee is entitled to this year
        const totalDaysEntitled = Math.floor(
          entitlementDaysPerYear * (monthsWorked / 12)
        );

        // Calculate the pro-rated accumulate leave for the months from January to November
        const leaveAccumulated =
          totalDaysEntitled -
          (entitlementDaysPerYear -
            Math.ceil(entitlementDaysPerYear / 12) * 11);

        return leaveAccumulated;
      }

      //hire date is static which is the start of january of current year
      const hireDate = `${moment().format("YYYY")}-01-01`;

      // Calculate the pro-rated accumulate leave for the months from January to November
      const proRatedLeave = computeProRatedLeave(allowedLeaves, hireDate);

      //set the value
      formik.setFieldValue("proRatedLeave", proRatedLeave);
    }
  };

  return (
    <div>
      <div className='md:grid md:grid-cols-3 md:gap-6'>
        <div className='md:col-span-1'>
          <div className='px-4 sm:px-0'>
            <h3 className='text-base font-semibold leading-6 text-gray-900 flex space-x-2 items-center'>
              <span>Leave Submittion </span>{" "}
              <Tooltip target='.logo' mouseTrack mouseTrackLeft={10}>
                The allowed leaves for a year are {allowedLeaves}
              </Tooltip>
              <AiFillInfoCircle className='logo cursor-pointer' />
            </h3>
            <p className='mt-1 text-sm text-gray-600'>
              Select and submit your leave request here.
            </p>
          </div>
          {formik.values.leaveDateRange &&
            formik.values.leaveDateRange[0] &&
            formik.values.leaveDateRange[1] && (
              <div className='py-2 w-full border border-gray-200 rounded-lg bg-white'>
                <div className='flex space-x-2 p-2'>
                  <span className='font-bold'>Range:</span>
                  <span>
                    From{" "}
                    <span className='font-semibold'>
                      {moment(formik.values.leaveDateRange[0]).format(
                        "DD MMM, YYYY"
                      )}
                    </span>{" "}
                    to{" "}
                    <span className='font-semibold'>
                      {moment(formik.values.leaveDateRange[1]).format(
                        "DD MMM, YYYY"
                      )}
                    </span>
                  </span>
                </div>
                <div className='flex space-x-2 p-2'>
                  <span className='font-bold'>Leave Balance:</span>
                  <span>{formik.values.leaveBalance}</span>
                </div>
                <div className='flex space-x-2 p-2 items-center'>
                  <span className='font-bold'>
                    Pro Rated Leave (from hiring day to current month):{" "}
                    <span className='font-normal'>
                      {" "}
                      {formik.values.proRatedLeave}
                    </span>
                  </span>
                </div>
              </div>
            )}
        </div>
        <div className='mt-5 md:col-span-2 md:mt-0'>
          <div className='shadow sm:overflow-hidden sm:rounded-md'>
            <div className='space-y-6 bg-white px-4 py-5 sm:p-6'>
              <div className='grid grid-cols-6 gap-6'>
                <div className='col-span-6 sm:col-span-3'>
                  <label
                    htmlFor='first-name'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Your name
                  </label>
                  <input
                    type='text'
                    name='employeeName'
                    id='employeeName'
                    value={formik.values.employeeName}
                    onChange={formik.handleChange}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  />
                  {formik.touched.employeeName &&
                    Boolean(formik.errors.employeeName) && (
                      <div className='text-red-600 text-sm'>
                        {formik.errors.employeeName}
                      </div>
                    )}
                </div>
                <div className='col-span-6 sm:col-span-3'>
                  <label
                    htmlFor='last-name'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Your Employee-ID
                  </label>
                  <input
                    type='text'
                    name='employeeId'
                    id='employeeId'
                    value={formik.values.employeeId}
                    onChange={formik.handleChange}
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  />
                  {formik.touched.employeeId &&
                    Boolean(formik.errors.employeeId) && (
                      <div className='text-red-600 text-sm'>
                        {formik.errors.employeeId}
                      </div>
                    )}
                </div>
              </div>
              <div className='grid grid-cols-3 gap-6'>
                <div className='col-span-3 sm:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Filling Type
                  </label>
                  <div className='mt-1 flex flex-col space-y-2 rounded-md shadow-sm'>
                    <div className='flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700'>
                      <input
                        type='radio'
                        name='filling-radio'
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                        id={"full-day-filling"}
                        value='full-day-filling'
                        onChange={(e) =>
                          formik.setFieldValue("fillingType", e.target.value)
                        }
                        checked={
                          formik.values.fillingType === "full-day-filling"
                        }
                      />
                      <label
                        htmlFor='full-day-filling'
                        className='w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                      >
                        Full-Day Filling
                      </label>
                    </div>
                    <div className='flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700'>
                      <input
                        type='radio'
                        id='half-day-filling'
                        name='filling-radio'
                        checked={
                          formik.values.fillingType === "half-day-filling"
                        }
                        value='half-day-filling'
                        onChange={(e) =>
                          formik.setFieldValue("fillingType", e.target.value)
                        }
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                      />
                      <label
                        htmlFor='half-day-filling'
                        className='w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                      >
                        Half-Day Filling
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor='about'
                  className='block text-sm font-medium text-gray-700'
                >
                  Date Range Selection
                </label>
                <div className='mt-1 flex items-center justify-center'>
                  <Calendar
                    value={formik.values.leaveDateRange}
                    onChange={calendarDatesChangeHelper}
                    id='leaveDateRange'
                    name='leaveDateRange'
                    inline
                    disabledDays={[0, 6]}
                    selectionMode='range'
                  />
                </div>
                {formik.touched.leaveDateRange &&
                  Boolean(formik.errors.leaveDateRange) && (
                    <div className='text-red-600 text-sm'>
                      {formik.errors.leaveDateRange}
                    </div>
                  )}
              </div>
              <div>
                <label
                  htmlFor='about'
                  className='block text-sm font-medium text-gray-700'
                >
                  Leave Reason
                </label>
                <div className='mt-1'>
                  <div>
                    <div className='w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600'>
                      <div className='px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800 w-full'>
                        <label htmlFor='reason' className='sr-only'>
                          Your comment
                        </label>
                        <textarea
                          id='reason'
                          rows={4}
                          className='w-full px-0 text-sm  text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400'
                          placeholder='Write your leave reason...'
                          value={formik.values.reason}
                          onChange={formik.handleChange}
                        />
                      </div>
                      <div className='flex items-center justify-end px-3 py-2 border-t dark:border-gray-600'>
                        <button
                          type='button'
                          onClick={formik.handleSubmit}
                          className='inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800'
                        >
                          Submit Leave
                        </button>
                      </div>
                    </div>
                    {formik.touched.reason && Boolean(formik.errors.reason) && (
                      <div className='text-red-600 text-sm'>
                        {formik.errors.reason}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstSection;
