import { useRouter } from 'next/router';

export async function get_data() {
    try {
        const resp = await fetch("/api/trytry", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        // const data = await resp.json()
        // console.log(data)
        // return data
    } catch(error) {
        console.error(error);
    }
}


export default async function Try({ params }: { params: { restaurant_id: string, table_id: string } }) {
    const {restaurant_id, table_id} = params;
    console.log("sssssssssssssss",restaurant_id, table_id)

    // const dat = get_data()


    const getSubscriptionDetails = async () => {
        try {
          const response = await fetch("/api/payment", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error(
              `Error getting document: ${response.status} ${response.statusText}`
            );
          }
          const data = await response.json();
        } catch (error) {
          console.error("Failed to fetch subscription details:", error);
        }
      };
    
    const data = getSubscriptionDetails();
    console.log(data)

    
    return (
        <div>
            <h1>Ordesssssssssr Page</h1>
            <p>{restaurant_id}</p>
            <p>{table_id}</p>
            {/* <p>{dat}</p> */}
        </div>
    )
}