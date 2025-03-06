import * as React from "react";

const Table = ({ children }: { children: React.ReactNode }) => {
  return <table className="w-full border-collapse">{children}</table>;
};

const TableHeader = ({ children }: { children: React.ReactNode }) => {
  return <thead className="bg-gray-100">{children}</thead>;
};

const TableRow = ({ children }: { children: React.ReactNode }) => {
  return <tr className="border-b">{children}</tr>;
};

const TableHead = ({ children }: { children: React.ReactNode }) => {
  return <th className="p-2 text-left">{children}</th>;
};

const TableBody = ({ children }: { children: React.ReactNode }) => {
  return <tbody>{children}</tbody>;
};

const TableCell = ({ children }: { children: React.ReactNode }) => {
  return <td className="p-2">{children}</td>;
};

export { Table, TableHeader, TableRow, TableHead, TableBody, TableCell };
