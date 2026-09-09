document.addEventListener("DOMContentLoaded", () => {
    let busRoutesData = {};

    // Local JSON ကို ဖတ်မည် (VPN မလိုပါ)
    fetch('ybs-routes.json')
        .then(response => response.json())
        .then(data => {
            busRoutesData = data;
            // စဖွင့်ချင်း ဥပမာ ရှာဖွေပြသရန်
            searchAndDisplayBuses("အသာ်ကာ", "ဆူးလေ");
        })
        .catch(err => console.error("Error loading routes:", err));

    function searchAndDisplayBuses(start, end) {
        const container = document.getElementById("bus-recommendations");
        container.innerHTML = "";

        let found = false;

        for (let busName in busRoutesData) {
            const stops = busRoutesData[busName];
            const startIndex = stops.findIndex(s => s.toLowerCase().includes(start.toLowerCase()));
            const endIndex = stops.findIndex(s => s.toLowerCase().includes(end.toLowerCase()));

            if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
                found = true;
                const relevantStops = stops.slice(startIndex, endIndex + 1);

                const busCard = document.createElement("div");
                busCard.className = "bus-item";
                busCard.innerHTML = `
                    <div class="bus-header">
                        <span>🚌 ${busName} (${relevantStops[0]} ➔ ${relevantStops[relevantStops.length - 1]})</span>
                        <span style="color:#008800; font-size:12px;">မှတ်တိုင် (${relevantStops.length}) ခု 🔽</span>
                    </div>
                    <div class="stops-list">
                        <b>ဖြတ်သန်းမည့် မှတ်တိုင်များ:</b><br>${relevantStops.join(" ➔ ")}
                    </div>
                `;

                // နှိပ်လိုက်ရင် မှတ်တိုင်အကုန်ပေါ်လာရန်
                busCard.querySelector(".bus-header").addEventListener("click", () => {
                    const list = busCard.querySelector(".stops-list");
                    list.classList.toggle("show");
                });

                container.appendChild(busCard);
            }
        }

        if (!found) {
            container.innerHTML = `<p style="font-size:13px; color:#666;">ဒီ route အတွက် တိုက်ရိုက်သွားမယ့် YBS မတွေ့ပါ — bus line ပြောင်းစီးနိုင်ပါသည် (transfer)</p>`;
        }
    }
});
