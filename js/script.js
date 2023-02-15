const imgContainer = document.querySelector('#imgContainer');
const searchError = document.querySelector('#errorMessage')
const amountError = document.querySelector('#errorMessage')
document.querySelector('button').addEventListener('click', getUserInput);


// Gets user input.
function getUserInput(event) {
    event.preventDefault();
    const searchBar = document.querySelector('#searchfield').value
    const amountField = document.querySelector('#number').value
    const sortMenu = document.querySelector('#sort').value

    console.log(amountField);
    console.log(searchBar);
    console.log(sortMenu);

    /* Checks if user input is empty and displays error message.
    If everything is ok, call getImages function. */
    if (searchBar === '') {
        searchError.innerText = 'Please enter search term.';
    } else if (amountField === '' || amountField === '0') {
        amountError.innerText = 'Please enter amount.';
    } else {
        imgContainer.innerHTML = '';
        getImages(searchBar, amountField, sortMenu);
        searchError.innerText = '';
        amountError.innerText = '';
    }
}

// Gets images from Flickr API.
function getImages(searchBar, amountField, sortMenu) {
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=40a60526a97a9f0559e79f8802fa5750&text=${searchBar}&sort=${sortMenu}&per_page=${amountField}&format=json&nojsoncallback=1`;

    console.log(url);

    // Prints error message if something went wrong.
    fetch(url)
        .then(response => {
            console.log(response);
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                throw 'Error, please try again.';
            }

        })
        .then(displayImages)
        .catch(error => {
            console.log(error);
            const errorMessage = document.createElement('h1')
            imgContainer.append(errorMessage)
            errorMessage.innerText = 'Something went wrong. Please try again.';
        });

    // Displays images. Prints error message if no images are found.
    function displayImages(allImages) {
        if (allImages.photos.photo.length === 0) {
            const noImageError = document.createElement('h1')
            imgContainer.append(noImageError)
            noImageError.innerText = 'No images found by your search term. Please try again.';
        }
        console.log(allImages.photos);

        // Creates img element and appends to imgContainer.
        allImages.photos.photo.forEach(photo => {
            const server = photo.server;
            const id = photo.id;
            const secret = photo.secret;
            const size = document.querySelector('#size').value;
            const imgUrl = `https://live.staticflickr.com/${server}/${id}_${secret}_${size}.jpg`;
            const img = document.createElement('img');

            img.src = imgUrl;
            imgContainer.append(img);

            // Opens images in new tab on click.
            const newTab = document.createElement('a');
            imgContainer.append(newTab)
            newTab.append(img)
            newTab.href = imgUrl;
            newTab.target = '_blank';
        });
    }
}
