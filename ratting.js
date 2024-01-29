class Ratting {
    #countStars // count stars
    #outputStars // render stars - append child to
    #wrapperStars // wrapper stars
    #postID  // id post
    #arrayStars = [] // array stars 
    #countUsers // count all users which send ratting
    #countRatting // all count ratting to this post
    #URL // url to send data

    constructor(_countStars, _outputStars, _postID, _countUsers, _countRatting, _URL) {
        // the constructor initializes the variables
        this.#countStars = _countStars
        this.#outputStars = document.querySelector(`${_outputStars}`)
        this.#postID = _postID
        this.#countUsers = _countUsers
        this.#countRatting = _countRatting
        this.#URL = _URL
        this.#createRatting()
    }

    get result() {
        return (this.#countRatting / this.#countUsers).toFixed(1)
    }

    #createRatting() {
        // create a rating
        let wrapper = document.createElement("div")
        wrapper.classList.add("star_items")
        this.#wrapperStars = wrapper
        for (let i = 1; i <= this.#countStars; i++) {
            // create star 
            const star = document.createElement("div")
            star.setAttribute("value", i)
            star.classList.add("star_item")
            // create star after
            const starAfter = document.createElement("div")
            starAfter.classList.add("star_item_after")
            star.appendChild(starAfter)
            // push star in array
            this.#arrayStars.push(star)
            // push star in container
            wrapper.appendChild(star)
        }
        this.#hasLocalStorage()
        this.#outputStars.appendChild(wrapper)
    }

    #hasLocalStorage() {
        // check whether we have already used the rating
        const idPosts = localStorage.getItem(this.#postID)
        !!idPosts ? this.#writeStars() : this.#activeStars()
    }

    #activeStars() {
        // we hang events on the rating
        this.#writeStars()
        this.#wrapperStars.addEventListener("mouseleave", () => this.#writeStars())

        this.#arrayStars.forEach((star, index) => {
            star.addEventListener("mouseenter", () => {
                this.#arrayStars.forEach((star, i) => {
                    star.firstChild.style.width = index >= i ? `100%` : 0
                })
            })

            star.addEventListener("click", () => {
                localStorage.setItem(this.#postID, this.#postID)
                ++this.#countUsers
                this.#countRatting += +star.getAttribute("value")
                this.#writeStars()
                this.#submitData()
                this.#wrapperStars.replaceWith(this.#wrapperStars.cloneNode(true))
            })

        })
    }

    #writeStars() {
        // here we sketch the rating
        this.#arrayStars.forEach((element, i) => {
            element.firstChild.style.width = (this.result - i).toFixed(1) > 1 ? `100%` : `${(this.result - i) * 100}%`
            if ((this.result - i).toFixed(1) < 0) element.firstChild.style.width = "0%";
        })
    }

    async #submitData() {
        // send data to database
        const data = { id: this.#postID, num: this.#countRatting, count: this.#countUsers }
        const requestOptions = { method: 'POST', body: JSON.stringify(data) };
        const response = await fetch(this.URL, requestOptions);
        return await response.json();
    }
}

const ratting = new Ratting(5, "body", 1, 1, 5, "")