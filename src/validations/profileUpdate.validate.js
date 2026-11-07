

const validateProfileUpdateData = async (req)=>{
    const allowedUpdates = ["name","age","gender","photoUrl"];

    const payload = req.body;

   const isValidUpdate =  Object.keys(payload).every((key)=> allowedUpdates.includes(key.toLowerCase().trim()));

   return isValidUpdate;
}

module.exports  = validateProfileUpdateData;