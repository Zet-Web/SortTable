import { useEffect, useState } from "react";
import "./index.scss";

import { useDispatch, useSelector } from "react-redux";
import { useGetCountQuery, useGetListQuery } from "../../redux/api/campaigns";
import { setCount, setList } from "../../redux/slices/Edit/campaign";

import { Backdrop, CircularProgress, ToggleButton,  } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import {
  CustomizedToggleButtonGroup,
  DataTable,
  Search,
} from "../../components";

import {
  SortedArticleTable,
  SortedSubjTable,
  SortedAdvertsTable,
} from "./components";

import { getStatusNameById, getTypeNameById } from "./helpers";

export const CampaignList = () => {
  const dispatch = useDispatch();
  
  const campaign = useSelector((state) => state.campaign);

  const {
    data: campaignList,
    isLoading: isGetCampaignListLoading,
    isSuccess: isGetCampaignListSuccess,
  } = useGetListQuery();

  const {
    data: campaignsCount,
    isLoading: isGetCampaignsCountLoading,
    isSuccess: isGetCampaignsCountSuccess,
  } = useGetCountQuery();

  useEffect(() => {
    if (!isGetCampaignListSuccess) return;

    dispatch(
      setList(
        campaignList.map((item) => ({
          ...item,
          Type: getTypeNameById(item.Type),
          statusId: item.statusId,
        }))
      )
    );
  }, [isGetCampaignListSuccess]);

  useEffect(() => {
    if (!isGetCampaignsCountSuccess) return;

    dispatch(setCount(campaignsCount));
  }, [isGetCampaignsCountSuccess]);

  const [sort, setSort] = useState(false);
  const [statusFilter, setStatusFilter] = useState("total");


  const setSortHandler = (_, sort) => setSort(sort);
  const setStatusFilterHandler = (_, status) => setStatusFilter(status);



  const getFilteredCompaigns = (list, statusFilter) => {
    const filteredList = list.filter(item => {
      switch (statusFilter) {
        case "total":
          return item
        case "active":
          return item.statusId === 9
        case "pause":
          return item.statusId === 11
        case "archive":
          return item.statusId === 7
      }
    })

    return filteredList.map(item => ({...item, statusId: getStatusNameById(item.statusId)}))
  }

  return (
    <div className="campaign-list">
      <div className="container">
        <div className="campaign-list__inner">
          <div className="campaign-list__filters">
            <div className="campaign-list__group">
              <div className="campaign-list__group-text">?????????????????????????? ????:</div>

              <div className="campaign-list__group-buttons">
                <CustomizedToggleButtonGroup
                  className="campaign-list__toggle-group"
                  color="primary"
                  value={sort}
                  exclusive
                  onChange={setSortHandler}
                >
                  <ToggleButton value="subj">????????????????</ToggleButton>
                  <ToggleButton value="article">????????????????</ToggleButton>
                  <ToggleButton value="adverts">???????? ??????????????</ToggleButton>
                </CustomizedToggleButtonGroup>
              </div>
            </div>

            <div className="campaign-list__filter">
              <div className="campaign-list__filter-text">????????????????????:</div>

              <div className="campaign-list__filter-buttons">
                <CustomizedToggleButtonGroup
                  className="campaign-list__toggle-group"
                  color="primary"
                  value={statusFilter}
                  exclusive
                  onChange={setStatusFilterHandler}
                >
                  {isGetCampaignListLoading ? (
                    <LoadingButton sx={{height: '48px'}} loading variant="outlined">
                      ??????
                    </LoadingButton>
                  ) : (
                    <ToggleButton size='medium'  value="total">?????? ({campaign.count.total})</ToggleButton>
                  )}

                  {isGetCampaignListLoading ?
                    <LoadingButton sx={{height: '48px'}} size='medium' loading variant="outlined">
                      ????????????????
                    </LoadingButton>
                   : <ToggleButton value="active">???????????????? ({campaign.count.active}) </ToggleButton>
                  }

                  {isGetCampaignListLoading ? (
                    <LoadingButton sx={{height: '48px'}} size='medium' loading variant="outlined">
                      ??????????????????????????
                    </LoadingButton>
                  ) : (
                    <ToggleButton value="pause">?????????????????????????? ({campaign.count.pause})</ToggleButton>
                  )}

                  {isGetCampaignListLoading ? (
                    <LoadingButton sx={{height: '48px'}} size='medium' loading variant="outlined">
                      ??????????
                    </LoadingButton>
                  ) : (
                    <ToggleButton value="archive">?????????? ({campaign.count.archive})</ToggleButton>
                  )}
                </CustomizedToggleButtonGroup>
              </div>
            </div>
          </div>

          <Search />

          <div className="campaign-list__table">
            {sort ? (
              <div className="campaign-list__table-sorted">
                {sort === "article" && (
                  <SortedArticleTable rows={campaign.list} />
                )}
                {sort === "subj" && <SortedSubjTable rows={campaign.list} />}
                {sort === "adverts" && (
                  <SortedAdvertsTable rows={campaign.list} />
                )}
              </div>
            ) : (
              <DataTable rows={getFilteredCompaigns(campaign.list, statusFilter)} />
            )}

            <Backdrop
              sx={{
                position: "absolute",
                backgroundColor: "#8c8c8c80",
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              open={isGetCampaignsCountLoading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </div>
        </div>
      </div>
    </div>
  );
};
