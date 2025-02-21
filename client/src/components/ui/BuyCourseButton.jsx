import React, { useEffect } from "react";
import { Button } from "./button";
import { Loader2 } from "lucide-react";
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi";
import { toast } from "sonner";

const BuyCourseButton = ({courseId}) => {
  const [createCheckoutSession,{data,isLoading,isSuccess,isError,error}]= useCreateCheckoutSessionMutation();
  // console.log(courseId)
  const purchaseCourseHandler=async()=>{
    await createCheckoutSession(courseId);
  }
  
  useEffect(()=>{
    if(isSuccess){
       if(data?.url){
        window.location.href = data.url; // Redirect to stripe checkout url
       }else{
        toast.error("Invalid response from server.")
       }
    } 
    if(isError){
      toast.error(error?.data?.message || "Failed to create checkout session")
    }
  },[data, isSuccess, isError, error])

  return (
  <Button onClick={purchaseCourseHandler} className="w-full">
    {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        "Purchase Course"
      )}
   
  </Button>
  )
};

export default BuyCourseButton;
