import { sortJobs, toTitleCase, formatTime } from '../utils';

function renderJobTypeIcon(job) {
    let jobTypeIcon = "";

    if (job.Type.includes("Fitting")) {
        jobTypeIcon = "add_box";
    } else if (job.Type.includes("Repair") || job.Type.includes("Remedial")) {
        jobTypeIcon = "build";
    } else if (job.Type.includes("Survey")) {
        jobTypeIcon = "search";
    } else if (job.Type.includes("Misc")) {
        jobTypeIcon = "search";
    } else if (job.Type.includes("Meeting")) {
        jobTypeIcon = "people";
    }

    return `
      <i class="material-icons mt-2" style="font-size: 48px;">${jobTypeIcon}</i>
    `;
}

function renderJobDetails(job) {
    return `
      <b>${job.Type}</b>
      <br />
      Expected to take ${job.Duration}hrs
    `;
}

function renderCustomerDetails(job) {
    return `
      <b>
        ${toTitleCase(job.Contact)}
        ${job.Postcode.toUpperCase()}
      </b>
    `;
}

function renderTimingDetails(job) {
    let iconName = "";
    let label = "";

    if (!job.RealStart) {
        iconName = "stop";
        label = "NOT STARTED";
    } else if (!job.RealEnd) {
        iconName = "play_circle_filled";
        label = `Started ${formatTime(job.RealStart)}`;
    } else {
        iconName = "watch_later";
        label = `Started ${formatTime(job.RealStart)} - Finished ${formatTime(job.RealEnd)}`;
    }

    return `
        <div class="timing-icon">
            <i class="material-icons" style="font-size: 25px;">${iconName}</i>
        </div>
        <div class="timing-label">
            ${label}
        </div>
        <div class="timing-icon2">
            <i class="material-icons" style="font-size: 25px;">${iconName}</i>
        </div>
    `;
}

function jobStatusColour(job) {
    if (!job.RealStart) {
        return "danger";
    } else if (!job.RealEnd) {
        return "warning";
    } else {
        if (job.Status.includes("issues")) {
            return "info";
        } else {
            return "success";
        }
    }
}

function jobStatusIcon(job) {
    let iconName = "";

    if (!job.RealStart) {
        iconName = "pause_circle_filled";
    } else if (!job.RealEnd) {
        iconName = "play_circle_filled";
    } else {
        if (job.Status.includes("issues")) {
            iconName = "feedback";
        } else {
            iconName = "check_circle";
        }
    }

    return `<i class="material-icons" style="font-size: 48px;">${iconName}</i>`;
}

function renderJob(job) {
    return `
        <div class="job-card">
            <div class="header ${jobStatusColour(job)}">
                <div class="type-icon">
                    ${renderJobTypeIcon(job)}
                </div>
                <div class="type">
                    ${renderJobDetails(job)}
                </div>
                <div class="status">
                    ${jobStatusIcon(job)}
                </div>
            </div>
            <div class="customer">
                ${renderCustomerDetails(job)}
            </div>
            <div class="timing">
                ${renderTimingDetails(job)}
            </div>
        </div>
    `;
}

function renderWorker(worker, jobs, position) {
    return `
        <div class="worker">
            <div class="location">
                <iframe src="https://google.com/maps/embed/v1/place?key=AIzaSyD55V3pJb2XQ02l44ecXJ5VgWWE8KRk-NM&zoom=9&q=${position}">
                </iframe>
            </div>
            <div class="name">${worker}</div>
            <div class="jobs">
                ${jobs.map(job => renderJob(job)).join('')}
            </div>
        </div>
    `;
}

export function renderDashboard(container, store, desiredWorkers) {
    const jobs = store.getState().bc.jobs;
    const positions = store.getState().bc.resources;
    let workers = {};
    let now = new Date();
    now.setHours(0, 0, 0, 0);
    let later = new Date(now.getTime());
    later.setHours(23, 59, 59, 999);

    jobs
        .filter(job => desiredWorkers.includes(job.Resource))
        .filter(job => job.PlannedStart)
        .filter(job => new Date(job.PlannedStart).getTime() >= now.getTime())
        .filter(job => new Date(job.PlannedStart).getTime() <= later.getTime())
        .sort(sortJobs)
        .map(job => {
            if (!workers[job.Resource]) {
                workers[job.Resource] = {};
                workers[job.Resource].jobs = [];
            }

            workers[job.Resource].jobs.push(job);
        });

    container.innerHTML = Object.keys(workers).map(key => {
        const position = positions
            .filter(resource => resource.ResourceName === key)
            .map(resource => {
                return `${resource.PositionLatitude},${resource.PositionLongitude}`;
            })
            .join('');

        return `${renderWorker(key, workers[key].jobs, position)}`;
    }).join('');
}