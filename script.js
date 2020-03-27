const fs = require('fs')
const conversion = require("phantom-html-to-pdf")();
const html = require("./html.js")
const axios = require("axios");
const inquirer = require("inquirer");



inquirer
    .prompt([{
        type: "input",
        name: "username",
        message: "Enter your GitHub username:"

    }, {
        type: "list",
        message: "What is your favorite color?",
        name: "color",
        choices: ["green", "blue", "pink", "red"]
    }])
    .then(function ({ username, color }) {
        const queryUrl = `https://api.github.com/users/${username}`
        const queryUrl2 = `https://api.github.com/users/${username}/repos?per_page=100`;

        axios.get(queryUrl).then(function (response1) {


            axios.get(queryUrl2).then(function (response2) {
                const repoNames = response2.data.map(function (repo) {
                    // console.log(repo.name)
                    return repo.name;

                });
                // console.log(res.data.id);

                const repoNamesStr = repoNames.join("\n");

                const data = {
                    ...response1.data,
                    ...response2.data,
                    color
                }

                // console.log(data)

                conversion({
                    html: html(data),

                }, function (err, pdf) {
                    if (err) {
                        console.log(err)
                    };
                    var output = fs.createWriteStream('html90.pdf')
                    console.log("HELLO")
                    // console.log(pdf.logs);
                    // console.log(pdf.numberOfPages);
                    // since pdf.stream is a node.js stream you can use it
                    // to save the pdf to a file (like in this example) or to
                    // respond an http request.
                    return pdf.stream.pipe(output);

                })
                // fs.writeFile("repos.txt", repoNamesStr, function (err) {
                //     if (err) {
                //         throw err;
                //     }
                //     queryUrl2
                //     console.log(`Saved ${repoNames.length} repos`);
                // });

            });







        });

    });


// conversion({
//     html: "/index.html",
//     waitForJS: true,
//     viewPortSize: {
//         height: 600,
//         width: 600
//     },
//     format: {
//         quality: 100
//     }
// }, function (err, pdf) {
//     if (err) {
//         return err;
//     }

//     var output = fs.createWriteStream('./html.pdf')
//     console.log(pdf.logs);
//     console.log(pdf.numberOfPages);
//     // since pdf.stream is a node.js stream you can use it
//     // to save the pdf to a file (like in this example) or to
//     // respond an http request.
//     pdf.stream.pipe(output);
// });