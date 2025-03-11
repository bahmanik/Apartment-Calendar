import { useState } from 'react';
import { ChangeEvent } from "react";

const NewEventModal = ({ date, onSave, onClose }: { date: string, onSave: (arg: eventT, arg2: number) => void, onClose: () => void }) => {

  const formObj = {
    Fname: "",
    Lname: "",
    Number: "",
    entryTimeMinute: "",
    entryTimeHour: "",
    exitTimeHour: "",
    exitTimeMinute: "",
    daysNum: "",
    deposit: "",
    totalAmount: "",
  }
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({})
  const [form, setForm] = useState<{ [key: string]: string }>(formObj)

  const onChange = (e: ChangeEvent<HTMLInputElement>, handler: (arg1: string) => boolean) => {
    const { name, value } = e.target
    setForm(pValue => ({ ...pValue, [name]: value }))
    setErrors((pErrors => ({ ...pErrors, [name]: handler(value) })))
  }

  const CustomeInput = ({ name, className, placeHolder, Handler }: { name: string, className?: string, placeHolder: string, Handler: (arg1: string) => boolean }) => {
    return <>
      <input
        name={name}
        value={form[name]}
        className={`eventInput ${className} ${errors[name] ? 'error' : ''}`}
        onChange={(e) => { onChange(e, Handler) }}
        placeholder={placeHolder}
        type="text"
        required
      />
    </>
  }

  return (
    <>
      <div className="Modal" id="newEventModal">
        <h2>New Event</h2>

        <div id='nameInput'>
          {CustomeInput({ name: "Lname", placeHolder: "فامیل", Handler: (arg: string) => !arg })}
          {CustomeInput({ name: "Fname", placeHolder: "اسم", Handler: (arg: string) => !arg })}
        </div>
        <div id='numberInput'>
          {CustomeInput({ name: "Number", placeHolder: "شماره", Handler: (arg: string) => isNaN(Number(arg)) || !arg })}
        </div>
        <div id='timeInput'>
          {CustomeInput({ className: "miniInput", name: "entryTimeMinute", placeHolder: "mm", Handler: (arg: string) => isNaN(Number(arg)) || !arg || arg.length > 2 })}
          <label >:</label>
          {CustomeInput({ className: "miniInput", name: "entryTimeHour", placeHolder: "hh", Handler: (arg: string) => isNaN(Number(arg)) || !arg || arg.length > 2 })}
          <label>زمان ورود</label>
          {CustomeInput({ className: "miniInput", name: "exitTimeMinute", placeHolder: "mm", Handler: (arg: string) => isNaN(Number(arg)) || !arg || arg.length > 2 })}
          <label >:</label>
          {CustomeInput({ className: "miniInput", name: "exitTimeHour", placeHolder: "hh", Handler: (arg: string) => isNaN(Number(arg)) || !arg || arg.length > 2 })}
          <label>زمان تخلیه </label>
        </div>
        <div id='budgetInput'>
          {CustomeInput({ name: "daysNum", placeHolder: "تعداد روزها", Handler: (arg: string) => isNaN(Number(arg)) || !arg || arg.length > 2 })}
          {CustomeInput({ name: "deposit", placeHolder: "بیعانه", Handler: (arg: string) => isNaN(Number(arg)) || !arg })}
          {CustomeInput({ name: "totalAmount", placeHolder: "مبلغ کل", Handler: (arg: string) => isNaN(Number(arg)) || !arg })}
        </div>

        <button
          onClick={() => {
            const outPut: eventT = {
              date: date,
              Fname: form.Fname,
              Lname: form.Lname,
              number: form.Number,
              deposit: form.deposit,
              totalAmount: form.totalAmount,
              entryTime: `${form.entryTimeHour}:${form.entryTimeMinute}`,
              exitTime: `${form.exitTimeHour}:${form.exitTimeMinute}`
            };

            // Start with a copy of the current errors (if needed)
            let computedErrors = { ...errors };

            // Validate exitTime length
            if (outPut.exitTime.length !== 5) {
              if (form.exitTimeHour.length === 1) {
                computedErrors = { ...computedErrors, exitTimeHour: true };
              }
              if (form.exitTimeMinute.length === 1) {
                computedErrors = { ...computedErrors, exitTimeMinute: true };
              }
            }

            // Validate entryTime length
            if (outPut.entryTime.length !== 5) {
              if (form.entryTimeHour.length === 1) {
                computedErrors = { ...computedErrors, entryTimeHour: true };
              }
              // Corrected: Check entryTimeMinute instead of exitTimeMinute
              if (form.entryTimeMinute.length === 1) {
                computedErrors = { ...computedErrors, entryTimeMinute: true };
              }
            }


            // Validate that no form field is empty
            Object.keys(form).forEach(f => {
              if (form[f].length === 0) {
                computedErrors = { ...computedErrors, [f]: true };
              }
            });

            // seting default for daysNum
            if (form.daysNum.length === 0) {
              setForm({ ...form, daysNum: "1" })
              computedErrors = { ...computedErrors, daysNum: false }
            }
            // Update the error state once
            setErrors(computedErrors);

            // If there are no errors, then proceed with the save action.
            // We consider a field error-free if its value is false or undefined.
            const noErrors = Object.keys(computedErrors).every(
              key => computedErrors[key] === false || computedErrors[key] === undefined
            );

            if (noErrors) {
              onSave(outPut, form.daysNum.length ? Number(form.daysNum) : 1)
            }
          }}
          id="saveButton"
        >
          Save
        </button>

        <button
          onClick={onClose}
          id="cancelButton">Cancel</button>
      </div >

      <div id="modalBackDrop"></div>
    </>
  )
}

export default NewEventModal
