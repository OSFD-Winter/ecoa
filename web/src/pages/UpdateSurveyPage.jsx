import Styles from "./UpdateSurveyPage.module.css";

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import ActiveQuestion from "../components/ActiveQuestion";

const UpdateSurveyPage = (props) => {
  const [questions, setQuestions] = useState([]);
  const [surveyData, setSurveyData] = useState({
    ...props.survey,
    questionIds: [],
  });

  const [survey, setSurvey] = useState({});
  const [sendSurvey, setSendSurvey] = useState({
    title: survey.title,
    questionIds: survey.questionIds,
    startDate: survey.startDate,
    endDate: survey.endDate,
  });
  const [error, setError] = useState("");

  console.log("props");
  console.log(props);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setSendSurvey({ ...sendSurvey, [e.target.name]: e.target.value });
    setSurveyData({ ...surveyData, [e.target.name]: e.target.value });
  };

  console.log("questions");
  console.log(questions);
  // console.log(surveyData);

  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

  const handleQuestionSelection = (questionId, isActive) => {
    if (isActive) {
      setSelectedQuestionIds((prevState) => [...prevState, questionId]);
    } else {
      setSelectedQuestionIds((prevState) =>
        prevState.filter((id) => id !== questionId)
      );
    }
  };

  // setSurveyData({
  //     ...surveyData,
  //     questionIds: selectedQuestionIds,
  // });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/questions");
        // console.log(res);
        setQuestions(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchQuestions();
  }, [questions]);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/surveys/${props.id}`
        );
        // console.log(res);
        setSurvey(res.data);
        const ids = [];
        res.data.questions.map((question) => {
          if (question.isActive) {
            ids.push(question.id);
          }
        });
        setSendSurvey({
          title: res.data.title,
          questionIds: ids,
          startDate: res.data.startDate,
          endDate: res.data.endDate,
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchSurvey();
  }, [sendSurvey]);

  // console.log("Survey");
  // console.log(survey);

  const toggleActive = (id) => {
    // setSurvey(
    // 	...survey,
    // 	survey.questions[id].isActive = !survey.questions[id].isActive
    // )
    // const checkbox = survey.questions[id];
    // if (checkbox.isActive) {
    // 	setSendSurvey({
    // 		...sendSurvey,
    // 		questionIds: [...sendSurvey.questionIds, checkbox.id]
    // 	})
    // } else {
    // 	setSendSurvey({
    // 		...sendSurvey,
    // 		questionIds: sendSurvey.questionIds.filter(
    // 			questionId => questionId !== checkbox.id
    // 		)
    // 	})
    // }

    console.log(id);
    const ids = sendSurvey.questionIds;
    if (ids.includes(id)) {
      setSendSurvey({
        ...sendSurvey,
        questionIds: sendSurvey.questionIds.filter(
          (questionId) => questionId !== id
        ),
      });
    } else {
      setSendSurvey({
        ...sendSurvey,
        questionIds: [...sendSurvey.questionIds, id],
      });
    }
  };

  const cancelButton = (e) => {
    e.preventDefault();
    console.log("cancel update");
    props.hideUpdateSurvey();
  };

  useEffect(() => {
    setSurveyData({
      ...surveyData,
      // Add the previous question ids and the new ones
      questionIds: [
        ...surveyData.questionIds,
        ...selectedQuestionIds.filter(
          (id) => !surveyData.questionIds.includes(id)
        ),
      ],
    });
  }, [surveyData]);

  const saveButton = async (e) => {
    e.preventDefault();
    console.log("save update");
    try {
      // setSendSurvey({
      // 	title: survey.title,
      // 	questionIds: survey.questionIds,
      // 	startDate: survey.startDate,
      // 	endDate: survey.endDate,
      // });
      setSurveyData({
        ...surveyData,
        questionIds: selectedQuestionIds,
      });
      const res = await axios.put(
        `http://localhost:8080/api/surveys/${props.survey.id}`,
        surveyData
      );
      console.log(res);
      props.hideUpdateSurvey();
      // window.location.reload();
      // window.location.reload("/administrator/surveys");
      // navigate("/administrator/surveys", { state: { sendSurvey } });
    } catch (err) {
      console.log(err);
      setError(err.response.data.error);
    }
  };

  const handleError = (err) => {
    if (!err) return;
    console.log(err);
    if (err.includes("must contain at least 1 element")) {
      return (
        <p className={Styles.error}>Selecciona por lo menos una pregunta</p>
      );
    } else if (err == "Could not parse Date string") {
      return <p className={Styles.error}>Recuerda llenar todos los campos</p>;
    } else if (err == "Cannot update survey that overlaps") {
      return (
        <p className={Styles.error}>La encuesta se empalma con otra encuesta</p>
      );
    } else if (err == "startDate cannot be greater than endDate") {
      return (
        <p className={Styles.error}>
          La fecha de inicio no puede ser mayor a la fecha de finalización
        </p>
      );
    } else if (err == "Cannot update survey with duplicate title") {
      return (
        <p className={Styles.error}>Ya existe una encuesta con ese título</p>
      );
    } else {
      return <p className={Styles.error}>{error}</p>;
    }
  };

  console.log(props);
  console.log("Send Survey");
  console.log(sendSurvey);
  console.log("Survey Data");
  console.log(surveyData);

  const getQuestionData = (id) => {
    console.log("id");
    setSendSurvey({
      ...sendSurvey,
      questionIds: [...sendSurvey.questionIds, id],
    });
    // console.log(id);
    // const question = questions.find((question) => question.id == id);
    // console.log("question");
    // console.log(question);
    // return question;
  };

  // ----------------------------
  // const [questions, setQuestions] = useState([]);
  // const [surveyData, setSurveyData] = useState({
  //     title: props.survey.title,
  //     questionIds: props.survey.questionIds,
  //     startDate: props.survey.startDate,
  //     endDate: props.survey.endDate,
  // });
  // // const [idArray, setIdArray] = useState([surveyData.questionIds]);

  // const [survey, setSurvey] = useState({});
  // const [sendSurvey, setSendSurvey] = useState({
  //     title: survey.title,
  //     questionIds: survey.questionIds,
  //     startDate: survey.startDate,
  //     endDate: survey.endDate,
  // });
  // const [error, setError] = useState("");

  // // console.log;

  // // const navigate = useNavigate();

  // const handleChange = (e) => {
  //     setSurveyData({ ...surveyData, [e.target.name]: e.target.value });
  // };

  // console.log(surveyData);
  // // console.log(questions);
  // // console.log(surveyData);

  // useEffect(() => {
  //     const fetchQuestions = async () => {
  //         try {
  //             const res = await axios.get(
  //                 "http://localhost:8080/api/questions"
  //             );
  //             // console.log(res);
  //             setQuestions(res.data);
  //         } catch (err) {
  //             console.log(err);
  //         }
  //     };
  //     fetchQuestions();
  // }, [questions]);

  // useEffect(() => {
  //     const fetchSurvey = async () => {
  //         try {
  //             const res = await axios.get(
  //                 `http://localhost:8080/api/surveys/${props.id}`
  //             );
  //             // console.log("res");
  //             // console.log(res);
  //             setSurvey(res.data);
  //             const ids = [];
  //             res.data.questions.map((question) => {
  //                 if (question.isActive) {
  //                     ids.push(question.id);
  //                 }
  //             });
  //             setSurveyData({
  //                 title: res.data.title,
  //                 questionIds: ids,
  //                 startDate: res.data.startDate,
  //                 endDate: res.data.endDate,
  //             });
  //         } catch (err) {
  //             console.log(err);
  //             setError(err.response.data.error);
  //         }
  //     };
  //     fetchSurvey();
  // }, [survey]);

  // // console.log("Survey");
  // // console.log(survey);

  // const toggleActive = (id) => {
  //     console.log(id);
  //     const ids = surveyData.questionIds;
  //     if (ids.includes(id)) {
  //         setSurveyData({
  //             ...surveyData,
  //             questionIds: ids.filter((questionId) => questionId !== id),
  //         });
  //     } else {
  //         setSurveyData({
  //             ...surveyData,
  //             questionIds: [...ids, id],
  //         });
  //     }
  // };

  // const cancelButton = (e) => {
  //     e.preventDefault();
  //     console.log("cancel update");
  //     props.hideUpdateSurvey(props.id);
  // };

  // const saveButton = async (e) => {
  //     e.preventDefault();
  //     console.log("save update");
  //     try {
  //         // setSendSurvey({
  //         // 	title: survey.title,
  //         // 	questionIds: survey.questionIds,
  //         // 	startDate: survey.startDate,
  //         // 	endDate: survey.endDate,
  //         // });
  //         const res = await axios.put(
  //             `http://localhost:8080/api/surveys/${props.survey.id}`,
  //             surveyData
  //         );
  //         console.log(res);
  //         props.hideUpdateSurvey(props.id);
  //         // window.location.reload();
  //         // window.location.reload("/administrator/surveys");
  //         // navigate("/administrator/surveys", { state: { sendSurvey } });
  //     } catch (err) {
  //         console.log(err);
  //         setError(err.response.data.error);
  //     }
  // };

  // const handleError = (err) => {
  //     if (!err) return;
  //     console.log(err);
  //     if (err.includes("must contain at least 1 element")) {
  //         return (
  //             <p className={Styles.error}>
  //                 Selecciona por lo menos una pregunta
  //             </p>
  //         );
  //     } else if (err == "Could not parse Date string") {
  //         return (
  //             <p className={Styles.error}>Recuerda llenar todos los campos</p>
  //         );
  //     } else if (err == "Cannot create survey that overlaps") {
  //         return (
  //             <p className={Styles.error}>
  //                 La encuesta se empalma con otra encuesta
  //             </p>
  //         );
  //     } else if (err == "startDate cannot be greater than endDate") {
  //         return (
  //             <p className={Styles.error}>
  //                 La fecha de inicio no puede ser mayor a la fecha de
  //                 finalización
  //             </p>
  //         );
  //     } else if (err == "Cannot create survey with duplicate title") {
  //         return (
  //             <p className={Styles.error}>
  //                 Ya existe una encuesta con ese título
  //             </p>
  //         );
  //     } else {
  //         return <p className={Styles.error}>{error}</p>;
  //     }
  // };

  return (
    <div className={Styles.overlay}>
      <div className={Styles.wrapper}>
        <div className={Styles.content}>
          <h2>Editar Encuesta</h2>
          <form className={Styles.form}>
            <div className={Styles.title}>
              <label htmlFor="title">Título</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Ingresa el título de la encuesta..."
                onChange={handleChange}
                defaultValue={survey.title}
              />
            </div>
            <div className={Styles.dates}>
              <div className={Styles.date}>
                <label htmlFor="startDate">Fecha de Inicio</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  onChange={handleChange}
                  defaultValue={survey.startDate}
                />
              </div>
              <div className={Styles.date}>
                <label htmlFor="endDate">Fecha de Finalización</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  onChange={handleChange}
                  defaultValue={survey.endDate}
                />
              </div>
            </div>
          </form>
          <div className={Styles.questions}>
            <div>
              <h3>Profesores</h3>
              {survey.questions?.map(
                (question) =>
                  question.section === "TEACHER" && (
                    <ActiveQuestion
                      key={question.id}
                      title={question.title}
                      data={question}
                      className={Styles.question}
                      onChange={handleChange}
                      toggleActive={handleQuestionSelection}
                      // TODO. Charge the toggle option
                    />
                  )
              )}
            </div>
            <div className={Styles.questions}>
              <h3>Materias</h3>
              {survey.questions?.map(
                (question) =>
                  question.section === "COURSE" && (
                    <ActiveQuestion
                      key={question.id}
                      title={question.title}
                      data={question}
                      className={Styles.question}
                      onChange={handleChange}
                      toggleActive={handleQuestionSelection}
                    />
                  )
              )}
            </div>
            <div className={Styles.questions}>
              <h3>Bloques</h3>
              {survey.questions?.map(
                (question) =>
                  question.section === "BLOCK" && (
                    <ActiveQuestion
                      key={question.id}
                      title={question.title}
                      data={question}
                      className={Styles.question}
                      onChange={handleChange}
                      toggleActive={handleQuestionSelection}
                    />
                  )
              )}
            </div>
          </div>
          {handleError(error)}
          <div className={Styles.buttons}>
            <button
              className={Styles.cancel}
              type="submit"
              onClick={cancelButton}
            >
              Cancelar
            </button>
            <button className={Styles.save} type="submit" onClick={saveButton}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateSurveyPage;
