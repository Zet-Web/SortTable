import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'

import {
  Box,
  Collapse,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Backdrop,
  CircularProgress,
} from "@mui/material";

import { DataTable } from '../../../../components/DataTable'

import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";

import {
  getStatusNameById,
  getTypeNameById,
  filteredArticlesBySubjName,
  getArticleSubjName,
  getCampaignsStats,
} from "../../helpers";

import {
  formatPrice,
  isUndefined,
  removeArrayDuplicates,
  removeArrayUndefined,
  roundNumber,
} from "../../../../utils";

import { useGetSubjNameQuery } from "../../../../redux/api/articles";

const CustomizedTableContainer = styled(TableContainer)({
  ".MuiTable-root th, .MuiTable-root td": {
    border: "1px solid #e0e0e0",
  },
  "thead.MuiTableHead-root": {
    background: "#9cbfcb",
  },
});

const Row = ({ row }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell component="th" scope="row">
          {row.subjName}
        </TableCell>

        <TableCell align="right">{row.subjsCount}</TableCell>
        <TableCell align="right">{formatPrice(row.campaigns.length)}</TableCell>
        <TableCell align="right">{formatPrice(row.stats.Views)}</TableCell>
        <TableCell align="right">{formatPrice(row.stats.Clicks)}</TableCell>
        <TableCell align="right">{roundNumber(row.stats.Ctr, 2)}</TableCell>
        <TableCell align="right">
          {formatPrice(Math.ceil(row.stats.Cpc))}
        </TableCell>
        <TableCell align="right">
          {formatPrice(Math.ceil(row.stats.spent))}
        </TableCell>
        <TableCell align="right">{formatPrice(row.stats.orders)}</TableCell>
        <TableCell align="right">
          {formatPrice(Math.ceil(row.stats.target))}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={11}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <DataTable rows={row.campaigns}/>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

export const SortedSubjTable = ({ rows }) => {
  const {
      data: subjNameData,
      isLoading: isGetSubjNameLoading,
      isSuccess: isGetSubjNameSuccess,
    } = useGetSubjNameQuery();

  const { text } = useSelector((state) => state.search);

  const [campaigns, setCampaigns] = useState([]);


  useEffect(() => {
    if (!isGetSubjNameSuccess) return;

    const campaignsSortedBySubjName = filteredArticlesBySubjName(
      subjNameData
    ).map((subjName) => {
      const campaigns = removeArrayUndefined(
        rows.map((campaign) => {
          const isArticleExists =
            campaign.nms.findIndex(
              (_article) =>
                getArticleSubjName(_article, subjNameData) === subjName
            ) !== -1;

          if (isArticleExists) {
            return campaign;
          }
        })
      );

      return {
        subjName: subjName,
        campaigns,
        subjsCount: removeArrayDuplicates(
          campaigns.map((campaign) => campaign.nms).flat(1)
        ).length,
      };
    });

    const campaignsSortedBySubjNameWithStats = campaignsSortedBySubjName.map(
      (sortedCampaign) => ({
        ...sortedCampaign,
        stats: getCampaignsStats(sortedCampaign.campaigns),
      })
    );

    setCampaigns(campaignsSortedBySubjNameWithStats);
  }, [isGetSubjNameSuccess]);

  return (
    <CustomizedTableContainer
      className="campaign-list__table-sorted-by-subj"
      component={Paper}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Предмет</TableCell>
            <TableCell align="right">Артикулов</TableCell>
            <TableCell align="right">Кампаний</TableCell>
            <TableCell align="right">Показы</TableCell>
            <TableCell align="right">Клики</TableCell>
            <TableCell align="right">CTR</TableCell>
            <TableCell align="right">Ср. цена клика</TableCell>
            <TableCell align="right">Потрачено</TableCell>
            <TableCell align="right">Продаж</TableCell>
            <TableCell align="right">Цена цели</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {campaigns &&
            campaigns.filter(item => item.subjName.toLowerCase().includes(text.toLowerCase())).map((row, index) => <Row key={index} row={row} />)}
        </TableBody>
      </Table>

      <Backdrop
        sx={{
          position: "absolute",
          backgroundColor: "#8c8c8c80",
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={isGetSubjNameLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </CustomizedTableContainer>
  );
};
