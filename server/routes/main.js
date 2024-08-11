const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/**
 * GET /
 * HOME
*/
router.get('', async (req, res) => {
  try {
    const locals = {
      title: "MK Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    // Count is deprecated - please use countDocuments
    // const count = await Post.count();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});

// router.get('', async (req, res) => {
//   const locals = {
//     title: "NodeJs Blog",
//     description: "Simple Blog created with NodeJs, Express & MongoDb."
//   }

//   try {
//     const data = await Post.find();
//     res.render('index', { locals, data });
//   } catch (error) {
//     console.log(error);
//   }

// });


/**
 * GET /
 * Post :id
*/
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    res.render('post', { 
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});


/**
 * POST /
 * Post - searchTerm
*/
// router.post('/search', async (req, res) => {
//   try {
//     const locals = {
//       title: "Seach",
//       description: "Simple Blog created with NodeJs, Express & MongoDb."
//     }

//     let searchTerm = req.body.searchTerm;
//     const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

//     const data = await Post.find({
//       $or: [
//         { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
//         { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
//       ]
//     });

//     res.render("search", {
//       data,
//       locals,
//       currentRoute: '/'
//     });

//   } catch (error) {
//     console.log(error);
//   }

// });

/**
 * POST /search
 * Post - searchTerm
 */
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm.trim();
    if (searchTerm === "") {
      return res.render("search", {
        data: [],
        locals,
        searchTerm: searchTerm,
        currentRoute: '/'
      });
    }

     // Escape special characters in the search term for regex
     const escapeRegex = (text) => {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }

    // Ensure regex matches the start of the string
    const regex = new RegExp(`^${escapeRegex(searchTerm)}`, 'i');
    // Ensure regex matches any part of the string
    // const regexPattern = `${escapeRegex(searchTerm)}`;
    // const regex = new RegExp(regexPattern, 'i');
    
    // Log regex to debug
    // console.log("Search Term: ", searchTerm);
    // console.log("Regex Pattern: ", regex);
    // console.log("Regex Object: ", regex);

    // Find documents where the title or body starts with the search term
    const data = await Post.find({
      $or: [
        { title: { $regex: regex } },
        // { body: { $regex: regex } }
      ]
    });

    // Log found data for debugging
    // console.log("Found Data: ", data);

    res.render("search", {
      data,
      locals,
      searchTerm: searchTerm,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while searching.");
  }
});



/**
 * GET /
 * About
*/
router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});

/**
 * GET POST/
 * Contact
*/

router.post('/submit-form', (req, res) => {
  // Process the form data here (e.g., send email, save to database)
  
  // After processing, render the contact.ejs page with a message
  res.render('contact', {
      currentRoute: '/contact',
      // message: 'Your message has been sent!'
      submissionStatus: 'success' 
  });
});

router.get('/contact', (req, res) => {
  res.render('contact', {
      currentRoute: '/contact',
      // message: '' // Initially no message
      submissionStatus: ''
  });
});


// function insertPostData () {
//   Post.insertMany([
//     {
//       title: "Building APIs with Node.js",
//       body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js"
//     },
//     {
//       title: "Deployment of Node.js applications",
//       body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments..."
//     },
//     {
//       title: "Authentication and Authorization in Node.js",
//       body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries."
//     },
//     {
//       title: "Understand how to work with MongoDB and Mongoose",
//       body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications."
//     },
//     {
//       title: "build real-time, event-driven applications in Node.js",
//       body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js."
//     },
//     {
//       title: "Discover how to use Express.js",
//       body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications."
//     },
//     {
//       title: "Asynchronous Programming with Node.js",
//       body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations."
//     },
//     {
//       title: "Learn the basics of Node.js and its architecture",
//       body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers."
//     },
//     {
//       title: "NodeJs Limiting Network Traffic",
//       body: "Learn how to limit netowrk traffic."
//     },
//     {
//       title: "Learn Morgan - HTTP Request logger for NodeJs",
//       body: "Learn Morgan."
//     },
//   ])
// }

// insertPostData();


module.exports = router;
