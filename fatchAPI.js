const URL = "https://cat-fact.herokuapp.com/facts";
//const URL = URI.toURL();

const getFact = async ()=>{
    console.log("getting data");
    let promise = await fetch(URL);
    console.log(promise);
};