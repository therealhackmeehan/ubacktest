import { FormInputProps } from "../Editor/Dashboard";

function FormInputHeader({ formInputs }: { formInputs: FormInputProps }) {

    return (
        <div className="flex justify-between mx-12 my-8 gap-x-2 rounded-md bg-slate-100 p-2">
            <div className="flex gap-x-6">
                <div className="font-extralight text-sm">started <span className="text-xl font-bold tracking-tight text-slate-700">{formInputs.startDate}</span></div>
                <div className="font-extralight text-sm">ended <span className="text-xl font-bold tracking-tight text-slate-700">{formInputs.endDate}</span></div>
            </div>
            <div className="font-extralight text-sm">trading frequency <span className="text-xl font-bold tracking-tight text-slate-700">{formInputs.intval}</span></div>
        </div>
    )
}

export default FormInputHeader;