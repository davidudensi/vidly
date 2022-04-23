const mongoose = require("mongoose");

mongoose
    .connect("mongodb://localhost/playground")
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => console.error("Could not connect to MongoDB...", err));

const authorSchema = new mongoose.Schema({
    name: String,
    bio: String,
    website: String,
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
    "Course",
    new mongoose.Schema({
        name: String,
        authors: [authorSchema],
    })
);

async function createCourse(name, authors) {
    const course = new Course({
        name,
        authors,
    });

    const result = await course.save();
    console.log(result);
}

async function updateCourse(courseId) {
    await Course.updateOne(
        {
            _id: courseId,
        },
        {
            $unset: {
                author: "",
            },
        }
    );
}

async function addAuthor(courseId, author){
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}

async function removeAuthor(courseId, authorId){
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId);
  author.remove();
  course.save();
}

async function listCourses() {
    const courses = await Course.find();
    console.log(courses);
}

removeAuthor('6263d8c118ef34b46dc6c149', '6263d9802013282220d07d20');