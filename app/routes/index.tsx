import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Pet Booker" },
    { name: "A place to book your pets in for the day", content: "Book your pets in!" },
  ];
}

export default function Index() {
  return (
    <div>
      <h1>Home page</h1>
      <p>Book a pet in and manage your clients&#39; fur-babies</p>
    </div> 
  )
}
