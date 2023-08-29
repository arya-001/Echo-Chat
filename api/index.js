const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cors = require("cors");
//
const jwt = require("jsonwebtoken");

const app = express();
const port = 8081;

app.use(cors());
// a middleware to handle url encoded form data
app.use(bodyParser.urlencoded({ extended: false }));
//handle json data
app.use(bodyParser.json());

// jwt token for
app.use(passport.initialize());

// mongoose connection
mongoose
  .connect("mongodb+srv://aryapolas:arya@cluster0.5dfk9al.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log("Error Connecting to MongoDb", err);
  });

app.listen(port, () => {
  console.log("server is running on port", port);
});

const User = require("./models/user");
const Message = require("./models/message");
const Post = require("./models/post");
const multer = require("multer");

/*######################################################################################################################*/
/*#########################################          ##################################################################*/
/*#######################################    Register    ###############################################################*/
/*#########################################          ##################################################################*/

app.post("/register", async (req, res) => {
  const { username, email, password, image } = req.body;
  try {
    /************************* Exisitng User Find **********************/
    /*******************************************************************/
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    /************************* New User ********************************/
    /*************************** Save **********************************/
    const newUser = new User({ username, email, password, image });
    //    newUser.save().then(()=>{
    //     res.status(200).json({message: "User Created Successfully"});
    //    })
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");
    await newUser.save().then(() => {
      res.status(200).json({ message: "User Created Successfully" });
    });

    sendVerificationEmail(newUser.email, verificationToken);
  } catch (err) {
    console.log("Error Registering" + err);
    res.status(500).json({ message: "Something's Wrong as Always" });
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "aryarpolas@gmail.com",
      pass: "rafwxrzjzljwebdn",
    },
  });

  const mailOptions = {
    from: "echo.com",
    to: email,
    subject: "Email Verification",
    text: `Please click the following link to verify you email http://localhost:3000/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error sending mail", error);
  }
};

app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid Token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).json({ message: "Email Verified" });
  } catch (error) {
    console.log("Email Verification failed", error);
    res.status(500).json({ message: "Error getting Email Verification" });
  }
});

const generateSecretKey = () => {
  const secretkey = crypto.randomBytes(32).toString("hex");
  return secretkey;
};

const secretKey = generateSecretKey();

/*######################################################################################################################*/
/*#############################################################################################################################*/
/*########################################################################################################################*/
/*#############################################################################################################################*/

/*######################################################################################################################*/
/*#########################################          ##################################################################*/
/*#######################################    Login    ###############################################################*/
/*#########################################          ##################################################################*/

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({ message: " Email and Password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);
    res.status(200).json({ token });
  } catch (error) {
    console.log("Login failed", error);
    res.status(500).json({ message: "Error While Logging In" });
  }
});

/*######################################################################################################################*/
/*######################################################################################################################*/
/*######################################################################################################################*/
/*######################################################################################################################*/

/*######################################################################################################################*/
/*#########################################          ##################################################################*/
/*#######################################    Users    ###############################################################*/
/*#########################################          ##################################################################*/
/*######################################################################################################################*/

/* access all friends ##################################################################*/

app.get("/users/:userId", (req, res) => {
  try {
    const loggedUser = req.params.userId;
    User.find({ _id: { $ne: loggedUser } })
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => {
        console.log("Error for getting friends from api endpoint", error);
        res.status(500).json("Error api endpoint");
      });
  } catch (error) {
    console.log(
      "Error getting all user except loggedin user from api endpoint"
    );
    res
      .status(500)
      .json({ message: "Error getting all Users from api endpoint" });
  }
});

/*######################################################################################################################*/
/*######################################################################################################################*/
/*######################################################################################################################*/
/*######################################################################################################################*/

/*  follow/add a request to user ######################################################### */
app.post("/follow-request", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;
  try {
    // update the follow/friend Request Array
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { receivefollowRequest: currentUserId },
    });

    // update the senders sent Request
    await User.findByIdAndUpdate(currentUserId, {
      $push: { sendfollowRequest: selectedUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    console.log("Error following a user", error);
    res.sendStatus(500);
  }
});

/*  unfollow/remove a request to user ######################################################### */

app.post("/unfollow-request", async (req, res) => {
  const { loggedUserId, targetUserId } = req.body;

  try {
    await User.findByIdAndUpdate(loggedUserId),
      {
        $pull: { followers: targetUserId },
      };
    await User.findByIdAndUpdate(targetUserId),
      {
        $pull: { followers: loggedUserId },
      };
    res.sendStatus(200);
  } catch (error) {
    console.log("Error unfollowing a user", error);
  }
});

/*  receive request from user ######################################################### */

app.get("/friend-request/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("userId:", userId);

    const user = await User.findById(userId)
      .populate("receivefollowRequest", "username image")
      .lean();

    const receivefollowRequest = user.receivefollowRequest;

    res.json(receivefollowRequest);
  } catch (error) {
    console.log("Error from api endpoint getting friend request", error);
  }
});

/*  Send / Accept request from user ######################################################### */

app.post("/friend-request/accept", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    sender.followers.push(receiverId);
    receiver.followers.push(sender);

    receiver.receivefollowRequest = receiver.receivefollowRequest.filter(
      (request) => request.toString() !== sender.toString()
    );

    sender.sendfollowRequest = sender.sendfollowRequest.filter(
      (request) => request.toString() !== receiver.toString()
    );

    await sender.save();
    await receiver.save();
    res.status(200).json({ message: "Friend Request Accepted " });
  } catch (error) {
    console.log("Error from api endpoint accepting friend request", error);
    res.status(500).json({ message: "Friend Request Failed " });
  }
});

/*  Accepted/followers request from user ######################################################### */

app.get("/accepted-friends/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "followers",
      "username image"
    );

    const acceptedFriends = user.followers;
    res.json(acceptedFriends);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Failed " });
  }
});

app.get("/friend-requests/sent/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("sendfollowRequest", "username image")
      .lean();

    const sendfollowRequest = user.sendfollowRequest;

    res.json(sendfollowRequest);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Internal Server friend request sent?" });
  }
});

app.get("/friends/:userId", (req, res) => {
  try {
    const { userId } = req.params;

    User.findById(userId)
      .populate("followers")
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const followerIds = user.followers.map((follower) => follower._id);

        res.status(200).json(followerIds);
      });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({ message: "internal server error of getting all followers" });
  }
});

/*######################################################################################################################*/
/*#########################################          ##################################################################*/
/*#######################################    Chat     ###############################################################*/
/*#########################################          ##################################################################*/

/** Chat : message of user to user api endpoint  #################################################### */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // Specify the desired destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/messages", upload.single("imageFile"), async (req, res) => {
  try {
    const { senderId, receiverId, messageType, message } = req.body;

    const newMessage = new Message({
      senderId,
      receiverId,
      messageType,
      message: message,
      timeStamp: new Date(),
      imageUrl: messageType === "image" ? req.file.path : null,
    });
    await newMessage.save();
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.log("Api Endpoint user to user message", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// chat header
app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Received userId:", userId);

    //fetch the user data from the user ID
    const receiverId = await User.findById(userId);

    res.json(receiverId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/messages/:senderId/:receiverId", async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).populate("senderId", "_id username");
    res.json(messages);
  } catch (error) {
    console.log("Api Endpoint error  for user to user messages", error);
    res
      .status(500)
      .json({ error: "Internal Server Error for user to user messages" });
  }
});

app.post("/deleteMessages", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "No messages to delete" });
    }

    await Message.deleteMany({ _id: { $in: messages } });
    res.json({ message: "Message deleted succesfully" });
  } catch (error) {
    console.log("Error deleting images ", error);
    res.status(500).json({ error: "Internal Server Error deleting messages" });
  }
});

/*######################################################################################################################*/
/*######################################################################################################################*/
/*######################################################################################################################*/
/*######################################################################################################################*/
app.post("/create-post", async (req, res) => {
  try {
    const { content, userId } = req.body;

    const newPostData = {
      user: userId,
    };

    if (content) {
      newPostData.content = content;
    }

    const newPost = new Post(newPostData);

    await newPost.save();

    res.status(200).json({ message: "Post saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "post creation failed" });
  }
});
app.put("/posts/:postId/:userId/like", async (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId; // Assuming you have a way to get the logged-in user's ID

  try {
    const post = await Post.findById(postId).populate("user", "username");

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } }, // Add user's ID to the likes array
      { new: true } // To return the updated post
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    updatedPost.user = post.user;

    res.json(updatedPost);
  } catch (error) {
    console.error("Error liking post:", error);
    res
      .status(500)
      .json({ message: "An error occurred while liking the post" });
  }
});

//endpoint to unlike a post
app.put("/posts/:postId/:userId/unlike", async (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId;

  try {
    const post = await Post.findById(postId).populate("user", "username");

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );

    updatedPost.user = post.user;

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error("Error unliking post:", error);
    res
      .status(500)
      .json({ message: "An error occurred while unliking the post" });
  }
});

//endpoint to get all the posts
app.get("/get-posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while getting the posts" });
  }
});

app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error while getting the profile" });
  }
});
