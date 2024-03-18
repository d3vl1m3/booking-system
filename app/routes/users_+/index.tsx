import { Link } from "@remix-run/react";

export default function ProfileListPage() {
    return (
        <div>
            <h1>List page</h1>
            <ul>
                <li>
                    <Link to="./user-1">Users 1</Link>
                </li>
                <li>
                    <Link to="./user-2">Users 2</Link>
                </li>
                <li>
                    <Link to="./user-3">Users 3</Link>
                </li>
                <li>
                    <Link to="./user-4">Users 4</Link>
                </li>
            </ul>

        </div>
    )
} 