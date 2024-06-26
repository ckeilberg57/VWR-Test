// *Scripts for Page

        window.onload = function() {
            setInterval(checkTempURL, 10000); // Check tempURL every 10 seconds
        };

        let sessions = JSON.parse(localStorage.getItem('sessions')) || [];

        function checkTempURL() {
            // Extract URLs from temp storage
            const sessionURLs = Object.keys(localStorage).filter(key => key.includes('tempURL'));

            if (sessionURLs.length > 0) {
                document.getElementById('sessionInfoContainer').style.display = 'block'; // Show the session info container

                // Loop through each session URL
                sessionURLs.forEach(urlKey => {
                    const tempURL = localStorage.getItem(urlKey);
                    // Extract name from the URL
                    const urlParams = new URLSearchParams(tempURL.split('?')[1]);
                    const name = urlParams.get('name');

                    // Create session info with the extracted name
                    if (name && !sessions.some(session => session.name === name)) {
                        createSessionInfo(name, tempURL);
                    } else {
                        console.error('Name not found in URL parameters or session already exists.');
                    }
                });
            } else {
                document.getElementById('sessionInfoContainer').style.display = 'none'; // Hide the session info container
            }
        }

        function createSessionInfo(name, tempURL) {
            const sessionInfoContainer = document.getElementById('sessionInfoContainer');

            // Create session info box
            const sessionInfoBox = document.createElement('div');
            sessionInfoBox.classList.add('session-info');

            // Create session image
            const sessionImage = document.createElement('img');
            sessionImage.src = "user.png";
            sessionImage.alt = "User Image";

            // Create session details
            const sessionDetails = document.createElement('div');
            sessionDetails.classList.add('session-details');

            // Create session name
            const nameBox = document.createElement('div');
            nameBox.classList.add('name');
            nameBox.textContent = name;

            // Create counter
            const counterBox = document.createElement('div');
            counterBox.classList.add('counter');
            counterBox.textContent = 'Added 00:00 ago';

            // Create join button
            const joinButton = document.createElement('button');
            joinButton.classList.add('join-button');
            joinButton.textContent = 'Join';
            joinButton.onclick = function() {
                removeSession(sessionInfoBox, tempURL);
            };

            // Append elements
            sessionDetails.appendChild(nameBox);
            sessionDetails.appendChild(counterBox);
            sessionInfoBox.appendChild(sessionImage);
            sessionInfoBox.appendChild(sessionDetails);
            sessionInfoBox.appendChild(joinButton);

            // Append session info box to container
            sessionInfoContainer.appendChild(sessionInfoBox);

            // Store the session information
            sessions.push({ name: name, tempURL: tempURL, startTime: Date.now() });

            // Start the timer for this session
            const intervalId = setInterval(function() {
                const session = sessions.find(session => session.name === name);
                if (session) {
                    const elapsedTime = Math.floor((Date.now() - session.startTime) / 1000);
                    const minutes = Math.floor(elapsedTime / 60);
                    const seconds = elapsedTime % 60;
                    const timeString = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
                    counterBox.textContent = `Added ${timeString} ago`;
                }
            }, 1000);

            // Save sessions to local storage
            localStorage.setItem('sessions', JSON.stringify(sessions));
        }

        function removeSession(sessionInfoBox, tempURL) {
            // Find the index of the session in sessions array
            const sessionIndex = sessions.findIndex(session => session.tempURL === tempURL);

            // Remove the session URL from localStorage
            const urlKey = Object.keys(localStorage).find(key => localStorage.getItem(key) === tempURL);
            if (urlKey) {
                localStorage.removeItem(urlKey);
            }

            // Remove the session info box from the UI
            sessionInfoBox.remove();

            // Open the updated URL in a new tab
            const urlParams = new URLSearchParams(tempURL.split('?')[1]);
            urlParams.set('name', 'Demo Provider');
            urlParams.set('role', 'host');
            urlParams.delete('join');
            const updatedParams = urlParams.toString();
            const updatedURL = `https://cklab-edges.ck-collab-engtest.com/webapp3/${window.location.pathname.split('/')[2]}?${updatedParams}`;
            window.open(updatedURL, '_blank');

            // Remove the session from the sessions array
            sessions.splice(sessionIndex, 1);

            // Save sessions to local storage
            localStorage.setItem('sessions', JSON.stringify(sessions));
        }
