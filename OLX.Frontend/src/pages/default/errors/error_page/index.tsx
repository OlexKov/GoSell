import { Button, Result } from "antd";
import { ResultStatusType } from "antd/es/result";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getAuth } from "../../../../redux/slices/userSlice";
import { IErrorProps } from "./props/index";

const ErrorPage: React.FC<IErrorProps> = ({ status, title, subTitle }) => {
  const [params] = useSearchParams();
  const {location} = useSelector(getAuth)
  const navigate = useNavigate();
  const locationData: IErrorProps | null = useLocation().state
  const [errorData, setErrorData] = useState<IErrorProps>({})

  useEffect(() => {
    setErrorData({
      location: params.get("location") || locationData?.location ,
      status: params.get("status") || status || locationData?.status || status,
      title: params.get("title") || title || locationData?.title || title,
      subTitle: params.get("subTitle") || subTitle || locationData?.subTitle || subTitle
    });
  }, [params, locationData])

 return (
    <>
      {
        (params.size === 0 && !locationData && !status && !title && !subTitle)
          ? <Navigate to={location} replace/>
          : <Result
          className="w-full content-center"
            status={errorData.status as ResultStatusType}
            title={errorData.title}
            subTitle={errorData.subTitle}
            extra={
              <Button className=" w-auto" type="primary" onClick={() => navigate(location)}>
                  Повернутися на головну
              </Button>
            }
          />
      }
    </>
  );
};

export default ErrorPage;