"use client"
import React, { FC, useState } from 'react';
import { Button } from "@/components/ui/button";

type LogProps = {
  name: string;
  data: any;
};

const DataLog: FC<LogProps> = ({ name, data }) => {
  const [showLog, setShowLog] = useState(true);

  return (
    <>
      <Button variant={showLog ? 'ninja' : 'destructive'} className="mb-2 mr-2" onClick={() => setShowLog(!showLog)}>
        {name} log
      </Button>
      <div className={`rounded-md border w-full ${showLog && 'hidden'}`}>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </>
  );
};

export default DataLog;