import { NextResponse } from "next/server";

// export async function DELETE(request: Request) {

export async function GET(request: Request) {
  try {
    console.log(
      "In /api/payment/subscription GET route (for subscription details)"
    );

    // const res = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/subscription/details`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${tokens?.token}`,
    //     },
    //   }
    // );

    // if (!res.ok) {
    //   // Read the error detail from the response and throw it as an error
    //   const errorDetail = await res.json(); // Assuming the backend sends a JSON response with a 'detail' field on error
    //   throw new Error(
    //     errorDetail.detail || `HTTP error! status: ${res.status}`
    //   ); // Use the detail if available, otherwise a generic message
    // }

    // const dataRes = await res.json();
    // console.log("data: ", dataRes);

    // Assume data contains a 'status' property

    // xxxx
    // const mock_json_path = "mock/burger_restauraunt.json";

    return NextResponse.json({ ok: 200 });
  } catch (error) {
    console.error(error);
    // return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500, // You might want to adjust the status code based on the error
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
