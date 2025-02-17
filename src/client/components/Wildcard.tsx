import { Link } from "wasp/client/router";
import ContentWrapper from "./ContentWrapper";

export default function Wildcard() {
    return (
        <ContentWrapper>
            <div className="m-8 p-8 text-center text-xl tracking-tight bg-slate-100 rounded-lg">
                Sorry, we couldn't find that page.
                <Link className="p-4 m-4 bg-slate-200 rounded-md" to="/home">Go Home</Link>
            </div>
        </ContentWrapper>
    )
}