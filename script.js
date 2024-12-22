// whenever DOM Content will be completely loaded then you can click on this it's goes inside the function.
document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-button");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const miduamProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLabel = document.getElementById("easy-level");
  const mediumLable = document.getElementById("medium-level");
  const hardLabel = document.getElementById("hard-level");
  const cardStatesCOntainer = document.querySelector(".stats-cards");

  // Function works on user-name is valid or not.(function returns true of false).
  function vaidUserName(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }
    // regular expression.
    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid Username");
    }
    return isMatching;
  }

  //   create a function for fetch API.
  async function fetchUserDetails(username) {
    try {
        searchButton.textContent = "Searching...";
        searchButton.disabled = true;
        statsContainer.classList.add("hide");

        const proxyUrl = "https://cors-anywhere.herokuapp.com/"; // Example of an alternative proxy
        const targetUrl = "https://leetcode.com/graphql/";

        const myHeaders = new Headers();
        myHeaders.append("content-type", "application/json");

        const graphql = JSON.stringify({

          // create a querry. for the particular userName
            query: `
                query userSessionProgress($username: String!) {
                    allQuestionsCount {
                        difficulty
                        count
                    }
                    matchedUser(username: $username) {
                        submitStats {
                            acSubmissionNum {
                                difficulty
                                count
                                submissions
                            }
                            totalSubmissionNum {
                                difficulty
                                count
                                submissions
                            }
                        }
                    }
                }
            `,
            variables: { username: username },
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: graphql,
            redirect: "follow",
        };

        // Concatinate the API (proxy and target).
        const response = await fetch(proxyUrl + targetUrl, requestOptions);
        // paesed the responce.
        if (response.status === 403) {
            throw new Error("Access to the resource is forbidden. Check your permissions or API key.");
        }

        if (response.status === 404) {
            throw new Error("The requested resource was not found.");
        }

        if (!response.ok) {
            throw new Error("Unable to fetch the User details");
        }

        const parsedData = await response.json();
        console.log("Logging data: ", parsedData);

        displayUserData(parsedData);

    } catch (error) {
        statsContainer.innerHTML = `<p>${error.message}</p>`;
    } finally {
        searchButton.textContent = "Search";
        searchButton.disabled = false;
    }
}


  function updateProgress(solved, total, lable, circle) {
    // calculate persentage.
    const progressDegree = (solved/total)*100;
    circle.style.setProperty("--progress-degree",`${progressDegree}%`);
    lable.textContent = `${solved}/${total}`;

  }
  //  Fetch Data From API.
  function displayUserData(parsedData) {
    const totalQues = parsedData.data.allQuestionsCount[0].count;
    const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
    const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
    const totalHardQues = parsedData.data.allQuestionsCount[3].count;

    const solvedTotalQues =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
    const solvedTotalEasyQues =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
    const solvedTotalMediumQues =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
    const solvedTotalHardQues =
      parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

    updateProgress(solvedTotalEasyQues,totalEasyQues,easyLabel,easyProgressCircle);
    updateProgress(solvedTotalMediumQues,totalMediumQues,mediumLable,miduamProgressCircle);
    updateProgress(solvedTotalHardQues,totalHardQues,hardLabel,hardProgressCircle);

    const cardData = [
      {lable: "Overall Submissions",value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
      {lable: "Overall Easy Submissions",value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
      {lable: "Overall Medium Submissions",value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
      {lable: "Overall Hard Submissions",value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions},
    ];

    console.log("card ka data: ", cardData);

    cardStatesCOntainer.innerHTML= cardData.map(
      data => {
        return `
        <div class="card">
        <h4>${data.lable}</h4>
        <p>${data.value}</p>
        </div>
        `
      }
    ).join("");
  }
  
  // when search Button is clicked. -> then do this process.
  // Add event Listner on search Button.
  searchButton.addEventListener("click", function () {
    // fetch userName.
    const username = usernameInput.value;
    console.log("Loggin username: ", username);
    // if my username is valid.
    if (vaidUserName(username)) {
      // fetch user detaills if valid user if you get the name.
      fetchUserDetails(username);
    }
  });
});


// Links-> https://cors-anywhere.herokuapp.com/corsdemo