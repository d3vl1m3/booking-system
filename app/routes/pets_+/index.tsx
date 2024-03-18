import { Link } from "@remix-run/react";

export default function PetsListPage() {
    return (
        <div>
            <h1>Pets List Page</h1>
            <ul>
                <li>
                    <Link to="./pet-1">Pet 1</Link>
                </li>
                <li>
                    <Link to="./pet-2">Pet 2</Link>
                </li>
                <li>
                    <Link to="./pet-3">Pet 3</Link>
                </li>
                <li>
                    <Link to="./pet-4">Pet 4</Link>
                </li>
            </ul>
        </div>
    )
} 