// This script will add the country selection menu to your watchlist
// All the countries on the menu were from letteboxd itself, last checked: 1 oct. 2024

// Check to see if it's in error screen
if (document.getElementById("content-nav") != null){
    // URL
    url_ar = window.location.href.split("/")
    country_index = url_ar.indexOf("country")

    new_url = ""
    new_url_ar = url_ar.slice() // Copies array
    new_url_ar.splice(new_url_ar.indexOf("country"),2) // Takes out 'country' and the country name from url

    // Sets url without the country parameters
    for (item in new_url_ar){
        if (new_url_ar[item] != ""){
            new_url += new_url_ar[item] + "/"
        }
        else{
            if (item == 1){ // If it isn't the first '/'
                new_url += new_url_ar[item] + "/"
            }
        }
    }
            
    // Country wrapper
    const div_smenu = document.createElement("div")
    div_smenu.className = "smenu"
    const label_country = document.createElement("label")
    label_country.innerHTML = `Country<i class="ir s icon"></i>`
    label_country.style.display = "none"
    div_smenu.append(label_country)
    const section = document.createElement("section")
    section.className = "smenu-wrapper"
    section.id = "country-wrapper"
    section.append(div_smenu)

    // Appends country wrapper
    document.getElementById("content-nav").getElementsByClassName("sorting-selects")[0].appendChild(section)

    // Get countries JSON resource file
    fetch(chrome.runtime.getURL('/countries.json')).then((response) => response.json())
    .then(function(json){ 
        var countries = Object.values(json)
                    
        // Country menu
        const ul_countryselection = document.createElement("ul")
        ul_countryselection.id = "country-menu"
        ul_countryselection.className = "smenu-menu"
        ul_countryselection.style.display = "none"
        ul_countryselection.style.top = "0px"
        ul_countryselection.style.left = "0px"
        ul_countryselection.style.height = "400px"
        ul_countryselection.setAttribute("data-placement", "right-start")

        const li_smenuselected = document.createElement("li")
        li_smenuselected.className = "smenu-selected"
        ul_countryselection.append(li_smenuselected)

        const li_smenusubselected = document.createElement("li")
        li_smenusubselected.className = "smenu-subselected"
        li_smenusubselected.id = "any-country"
        ul_countryselection.append(li_smenusubselected)

        const span_anycountry = document.createElement("span")
        span_anycountry.className = "selected"
        span_anycountry.innerText = "Any country"
        li_smenusubselected.append(span_anycountry)

        const li_dividerline = document.createElement("li")
        li_dividerline.className = "divider-line"
        ul_countryselection.append(li_dividerline)

        const ul_countries = document.createElement("ul")
        li_dividerline.append(ul_countries)

        for (country in countries){
            // Format for url
            country_formatted = countries[country].toLowerCase().replaceAll("'", "").replaceAll(",", "").replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "-")

            if (country_index != undefined && country_index != -1){ // If any country is already selected
                if (url_ar[country_index+1] == country_formatted || (url_ar[country_index+1] == "holy-see" && country_formatted == "vatican-city")){ // Exception for Vatican
                    // Properly adds country name to country wrapper
                    if (countries[country].length <= 20){
                        label_country.innerHTML = `${countries[country].slice(0, 20)}<i class="ir s icon"></i>`
                    }
                    else{ // If it's too big of a name
                        label_country.innerHTML = `${countries[country].slice(0, 20)}...<i class="ir s icon"></i>`
                    }

                    // Full country name to menu top
                    li_smenuselected.innerHTML = ` ${countries[country]}<i class="ir s icon"></i> `

                    // Adds selected country to menu
                    const li_countryitem = document.createElement("li")
                    li_countryitem.className = "smenu-subselected"
                    ul_countries.append(li_countryitem) 

                    const span_country = document.createElement("span")
                    span_country.className = "selected"
                    span_country.innerHTML = `<i class="ir s icon"></i>${countries[country]}`
                    li_countryitem.append(span_country)

                    // If there is a selected country, enable 'Any country'
                    li_smenusubselected.className = ""
                    li_smenusubselected.innerHTML = `<a class="item" href=${new_url}>Any country</a>`
                }
                else{ // Country that is not selected
                    const li_countryitem = document.createElement("li")
                    ul_countries.append(li_countryitem) 

                    const a_country = document.createElement("a")
                    a_country.className = "item"
                    a_country.innerHTML = `<i class="ir s icon"></i>${countries[country]}`
                    
                    // Exception for Vatican
                    if (country_formatted == "vatican-city"){
                        a_country.setAttribute("href", `${new_url}country/holy-see/`)
                    }
                    else{
                        a_country.setAttribute("href", `${new_url}country/${country_formatted}/`)
                    }

                    li_countryitem.append(a_country)
                }
            }
            else{
                // 'Country' to country wrapper
                label_country.innerHTML = `Country<i class="ir s icon"></i>`

                // 'Country' to menu top
                li_smenuselected.innerHTML = ` Country<i class="ir s icon"></i> `

                // Selected countries will use the current url with the formatted country
                const li_countryitem = document.createElement("li")
                ul_countries.append(li_countryitem) 

                const a_country = document.createElement("a")
                a_country.className = "item"
                a_country.innerHTML = `<i class="ir s icon"></i>${countries[country]}`

                // Exception for Vatican
                if (country_formatted == "vatican-city"){
                    a_country.setAttribute("href", `${window.location.href}country/holy-see/`)
                }
                else{
                    a_country.setAttribute("href", `${window.location.href}country/${country_formatted}/`)
                }

                li_countryitem.append(a_country)
            }
        }

        // Other letterboxd elements   
        const div_overflowsentinel = document.createElement("div")
        div_overflowsentinel.className = "smenu-overflowsentinel"
        ul_countryselection.append(div_overflowsentinel)

        const div_overflowindicator = document.createElement("div")
        div_overflowindicator.className = "smenu-overflowindicator"
        ul_countryselection.append(div_overflowindicator)

        const div_fade = document.createElement("div")
        div_fade.className = "fade"
        div_overflowindicator.append(div_fade)

        // Append country menu to site
        document.getElementsByClassName("smenu-menu")[0].after(ul_countryselection)

        label_country.style.display = "block"


        var timeout

        // If mouse is over for some time, show menu
        document.getElementById("country-wrapper").addEventListener("mouseover", function(){
            clearTimeout(timeout)
            timeout = window.setTimeout(showMenu, 400)
        })

        // Cancel menu hover timer
        document.getElementById("country-wrapper").addEventListener("mouseleave", function(){
            clearTimeout(timeout)
        })

        // Set coordinates for the country menu based on the wrapper
        var rect = document.getElementById("country-wrapper").getBoundingClientRect();
        ul_countryselection.style.transform = `translate(${rect.left-4}px, 209px)`

    })

    // Show menu
    function showMenu(){
        document.getElementById("country-menu").style.display = "block"   

        // If mouse leaves, make the menu invisible
        document.getElementById("country-menu").addEventListener("mouseleave", () => {
            document.getElementById("country-menu").style.display = "none"
        })
    }

    // Change menu coordinates when resizing
    addEventListener("resize", (event) => {
        var rect = document.getElementById("country-wrapper").getBoundingClientRect();
        document.getElementById("country-menu").style.transform = `translate(${rect.left-4}px, 209px)`
    })
}
