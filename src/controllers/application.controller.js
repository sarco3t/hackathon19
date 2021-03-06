import mongoose from "mongoose";

const Application = mongoose.model("Application");
const Company = mongoose.model("Company");

async function create(req, res) {
    const company = await Company.findByLocation(req.body.location);
    if (!company) {
        return res.status(404)
            .json({
                error: true,
                message: "Company not found"
            });
    }
    req.body.user = req.user._id;
    req.body.company = company._id;
    let application = new Application(req.body);
    await application.save();
    return res.json({
        error: false,
        model: application
    });
}


async function update(req, res) {
    let application = await Application.findById(req.params.id);
    if (!application) {
        return res.status(404)
            .json({
                error: true,
                message: "Application not found"
            });
    }
    Object.keys(req.body).forEach(key => {
        application[key] = req.body[key];
    });
    await application.save();
    return res.json({
        error: false,
        model: application
    });
}

async function remove(req, res) {
    let application = await Application.findById(req.params.id);
    if (!application) {
        return res.status(404)
            .json({
                error: true,
                message: "Application not found"
            });
    }
    await application.remove();
    return res.json({
        error: false
    });
}

async function all(req, res) {
    let queryParams = {};
    if (req.query.description) {
        queryParams.description = new RegExp(`.*${req.query.description}.*`, "i");
    }
    if (req.query.user) {
        queryParams.user = req.query.user;
    }
    let applications = await Application.find(req.query.description ? { description: regex } : {});
    if (!applications || !applications.length) {
        return res.status(404)
            .json({
                error: true,
                message: "Applications not found"
            });
    }
    return res.json({
        error: false,
        model: applications
    });
}

async function load(req, res) {
    let application = await Application.findById(req.params.id);
    if (!application) {
        return res.status(404)
            .json({
                error: true,
                message: "Application not found"
            });
    }
    return res.json({
        error: false,
        model: application
    });
}

export default {
    create,
    update,
    remove,
    all,
    load
}