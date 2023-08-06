type Trace = {
  idtraces: number;
  actor: string;
  verb: string;
  object: string;
  timestamp: Date;
};

const getTraces = async () =>
  await (await fetch("http://localhost:4000/api/traces")).json();
const getModelInfo = async () =>
  await (await fetch("http://localhost:4000/api/model")).json();

const getAlerts = async () =>
  await (await fetch("http://localhost:4000/api/report/alerts")).json();
const getStatsVerb = async (session) => {
  try {
    const response = await fetch(
      "http://localhost:4000/api/traces/stats/verb/" + session
    );
    const sessions = await response.json();
    return sessions;
  } catch (error) {
    console.log(error);
    return [];
  }
};
const getStatsActor = async (session) => {
  try {
    const response = await fetch(
      "http://localhost:4000/api/traces/stats/actor/" + session
    );
    const sessions = await response.json();
    return sessions;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getReport = async (session) => {
  try {
    const response = await fetch("http://localhost:4000/api/report/" + session);
    const report = await response.json();
    return report;
  } catch (error) {
    console.log(error);
    return [];
  }
};
const startSession = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/sessions", {
      method: "POST",
    });
    const session = await response.json();
    return session;
  } catch (error) {
    console.log(error);
  }
};

const closeSession = async (id_session) => {
  try {
    const response = await fetch("http://localhost:4000/api/sessions", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_session }),
    });
    const session = await response.json();
    return session;
  } catch (error) {
    console.log(error);
  }
};

const getSessions = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/sessions");
    const sessions = await response.json();
    return sessions;
  } catch (error) {
    console.log(error);
  }
};

export {
  getTraces,
  getStatsVerb,
  getStatsActor,
  startSession,
  closeSession,
  getSessions,
  getReport,
  getAlerts,
  getModelInfo,
};
