//selector
const select = selectors => {
  return document.querySelector(selectors);
};

//declaration
let search = select("#search");
let result_containner = select(".result-list");
let empty_result_div = select(".container-empty");
let modal = select(".modal");
let result_p = select(".result-p");
let count = 0;

let numberFormat = number => {
  return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

let style_growth = val => {
  return val[0] == "0" || val[0] == "-"
    ? '<b class="text-red">' + val + "<b>"
    : '<b class="text-green">' + val + "<b>";
};

// filter
let filterText = value => {
  let res = value.replace(/ +/g, " "); // remove all the spaces
  res = res.toLowerCase();
  return res;
};

// for search data
let search_data = (value, key) => {
  value = filterText(value);
  key = filterText(key);
  return value.search(key) == 0 ? true : false;
};

// highlite
let colorLise = (str, key) => {
  str = filterText(str);
  key = filterText(key);
  let newS = str.replace(key, "<u class='highlited'>" + key + "</u>");
  return newS;
};

// close button
select(".modal-close").addEventListener(
  "click",
  () => (select(".modal").style.display = "none")
);

////////////////////////////////////////////////////////////////
search.onkeyup = () => {
  count = 0;
  result_containner.innerHTML = `
    <div class="no-data">
        <h1> Loading... </h1>
    </div>
    `;
  empty_result_div.style.display = "none";

  if (search.value !== "") {
    fetch(
      "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json"
    )
      .then(response => {
        return response.json();
      })
      .then(myJson => {
        result_containner.innerHTML = "";

        for (const key in myJson) {
          const result = myJson[key];

          if (
            search_data(myJson[key].city, search.value) ||
            search_data(myJson[key].state, search.value)
          ) {
            count++;

            result_containner.innerHTML += `
                <div class="result-item" onclick="modalDiv(${result.rank})">
                <h2>${colorLise(result.city, search.value)}</h2>
                <section>
                    <label>State:</label>
                    <b>${colorLise(result.state, search.value)}</b>
                </section>
                <section>
                    <label>Population:</label> <b>${numberFormat(
                      result.population
                    )}</b>
                </section>
                <section>
                    <label>growth from 2000 to 2013:</label> <b>${numberFormat(
                      style_growth(result.growth_from_2000_to_2013)
                    )}</b>
                </section>
            </div>

            `;
          }
        }
        result_p.innerHTML = `<b>${count}</b> Results found.`;

        if (count == 0) {
          result_containner.innerHTML = `
              <div class="no-data">
              
              <h2>Your search - <b>${
                search.value
              }</h2> - did not match any City or State.</p>

              </div>
              `;
        }
      });

    empty_result_div.style.display = "none";
  } else {
    result_p.innerHTML = "";
    empty_result_div.style.display = "block";
    result_containner.innerHTML = "";
    console.log("empty");
  }
};

// modaly
const modalDiv = MY => {
  console.log("kojjerer");
  fetch(
    "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json"
  )
    .then(response => {
      return response.json();
    })
    .then(myJson => {
      for (const key in myJson) {
        const result = myJson[key];

        if (result.rank == MY) {
          select(".title-modal-span").innerHTML = "";
          select(".title-modal-span").innerHTML = result.city;
          select(".modal").style.display = "block";
          // load contents
          select(".modal-contents").innerHTML = "";

          for (const item in result) {
            select(".modal-contents").innerHTML += `
              <section>
                <label>${item.replace(/_+/g, " ")}</label>
                <h3>${display(item, result[item])}</h3>
                <section/>
             `;
          }
        }
      }
    });
};

const display = (type, val) => {
  if (type == "population") {
    return numberFormat(val);
  } else if (type == "growth_from_2000_to_2013") {
    return style_growth(val);
  } else {
    return val;
  }
};
