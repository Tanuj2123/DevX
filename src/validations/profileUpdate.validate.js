

const validateProfileUpdateData = async (req)=>{
    const allowedUpdates = ["name","age","gender"];

    const payload = req.body;

   const isValidUpdate =  Object.keys(payload).every((key)=> allowedUpdates.includes(key));

   return isValidUpdate;
}

module.exports  = validateProfileUpdateData;