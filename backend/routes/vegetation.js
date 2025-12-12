import express from "express";
import axios from "axios";
const router = express.Router();

const API_URL = "https://api-connect.eos.com/api/gdw/api";
const API_KEY = process.env.API_KEY;

const API_SCENE = "https://api-connect.eos.com/api/lms/search/v2/sentinel2";




const getScene = async (date, geometry)=>{
  try{
    const res = await axios.post(`${API_SCENE}?api_key=${API_KEY}`,{
      fields:["sceneID","cloudCoverage"],
      limit:2,
      page:1,
      search:{
        date:{
          from:"2025-10-01",
          to:"2025-11-02",
        },
        cloudCoverage:{
          from:0,
          to:80
        },
        shape:geometry,
      },
      sort:{
        date:"desc"
      }
    }); 
    const viewId = res.data.results[0].view_id;
    console.log("view : ",viewId);
    return viewId;
  }catch(e){
    console.error("Scene error");
  }
};

const createTask = async (viewId,geometry)=>{
  try{
     const res = await axios.post(`${API_URL}?api_key=${API_KEY}`,{
        type:"jpeg",
        params:{
          view_id: viewId,
          bm_type:"B04,B03,B02",
          geometry,
          px_size:5,
          format:"png",
          reference:"RGB-ref_datetime",
        },
     });
     const taskId = res.data.task_id;
     console.log("task : ",taskId);
     return taskId;
  }catch(e){
     console.error("Error in task");
  }
};

router.post("/images",async (req,res)=>{
  const {geometry,date_start,date_end} = req.body;
  try{
      const scene1 = await getScene(date_start,geometry);
      const task1 = await createTask(scene1,geometry);
      const result1 = await axios.get(`${API_URL}/${task1}?api_key=${API_KEY}`);
      const scene2 = await getScene(date_end,geometry);
      const task2 = await createTask(scene2,geometry);
      const result2 = await axios.get(`${API_URL}/${task2}?api_key=${API_KEY}`);
     console.log(result1.data.result_url);
     console.log(result2.data.result_url);
      res.status(200).json({
        image1 : result1.data.result_url,
        image2:result2.data.result_url
      });
  }catch(e){
    console.error("Image not found : ",e);
  }
});

router.post("/", async (req, res) => {
  const { geometry, date_start, date_end, indices } = req.body;
  try {
    const taskRes = await axios.post(`${API_URL}?api_key=${API_KEY}`, {
      type: "mt_stats",
      params: {
        bm_type: indices,
        date_start,
        date_end,
        geometry,
        reference:`ref_${Date.now()}`,
        sensors: ["sentinel2"],
      },
    });
    console.log(taskRes);
    const taskId = taskRes.data.task_id;
    console.log(taskId);
    let result = null;
    for (let i = 0; i < 20; i++) {
      const check = await axios.get(`${API_URL}/${taskId}`, {
        headers: { "x-api-key": API_KEY },
      });
      if (check.data.result && check.data.result.length > 0) {
        result = check.data.result;
        break;
      }
      await new Promise((r) => setTimeout(r, 5000));
    }
    if (!result) {
      return res.status(202).json({ message: "Still processing, try again later." });
    }
     res.json(result[0].indexes);
  } catch (e) {
    console.error("API error : ", e);
  }
});

router.post("/image",async (req,res)=>{

});

export default router;
