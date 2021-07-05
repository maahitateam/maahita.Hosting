(function () {
    const displyDeepLink = () => {
        const userAgent = navigator.userAgent;
        let isMobile = false;
        const mobileApp = document.getElementById('mobile-app');
        const androidMarketting = document.getElementById('android-marketting');
        const appleMarketting = document.getElementById('apple-marketting');
        if (userAgent.includes("Android")) {
            isMobile = true;
            mobileApp.innerHTML = 'māhita is now on ' + androidMarketting.innerHTML;
        }
        if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
            isMobile = true;
            mobileApp.innerHTML = 'māhita is now on ' + appleMarketting.innerHTML;
        }
        if (isMobile) {
            mobileApp.style.display = 'block';
        }
    };

    const sessiontemplate = (data) => {
        const dateString = (new Date(data.date)).toLocaleString();
        return `<div class='detail-info'>
            <hgroup>
                <h3 class = "det-txt">OUR LAST SESSION RATINGS</h3>
                <h4 class = "det-p">Session: ${data.title}</h4>
                <h5 class = "sm-txt"> (${dateString}) </h5>
            </hgroup>
            <div>
                <div class="det-p">Presenter: ${data.presenter}</div>
                <div class="det-p">We asked the attendees, "How was the session ?" and the response was this</div>
            </div>
            <div>
                <h4>Visit our YouTube channel for our previous sessions.</h4>
                <a title="māhita youtube channel" target="_blank" href="https://www.youtube.com/channel/UCL4i-Pm-42jyT7kvLTVmSKA">
                    <img src="../img/youtube.png" alt="youtube profile logo" style="width:100%;height:125px;">
                </a>
            </div>
        </div>`;
    };

    const fetchlatestsession = async () => {
        try {
            const response = await fetch('https://us-central1-mahita-2c3b1.cloudfunctions.net/getLatestSession');
            const latestsession = await response.json();
            const template = sessiontemplate(latestsession);
            document.getElementById('latestsessiondiv').innerHTML = template;
        } catch (error) {
            console.log(error);
        }
    };

    const addsubscriber = async (e) => {
        try {
            const email = document.getElementById("useremail");
            const commentsForm = document.getElementById('workshop-newsletter-form');
            const form = new FormData(commentsForm);
            console.log(form.get('useremail'), form.get('fullname'), form.get('comments'));
            if (!email.checkValidity()) {
                return;
            }
            const options = {
                method: 'POST',
                mode: 'no-cors',
                headers: new Headers(
                    {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                ),
                body: JSON.stringify({ 'email': email.value, 'fullname': form.get('fullname'), 'comments': form.get('comments') })
            };

            const res = await fetch("https://us-central1-mahita-2c3b1.cloudfunctions.net/addsubscriber", options);
            if (res) {
                document.getElementById('status').style.display = 'block';
                document.getElementById('status').innerHTML = 'Thank you for your interest, māhita team will contact you.';
                commentsForm.reset();
            }
        } catch (error) {
            console.log(error);
        }
    };
    document.getElementById('btnSubmit').addEventListener('click', addsubscriber);
    displyDeepLink();
    fetchlatestsession();
})();