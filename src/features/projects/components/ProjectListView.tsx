"use client";
import { useMemo, useState } from "react";
import {
  useDashboard,
  DashboardActionLink,
  DashboardEmptyState,
  DashboardPageHeader,
} from "@/features/dashboard/public";
import { ProjectRow } from "./ProjectRow";
import {
  filterAndSortProjects,
  type ProjectSort,
  type ProjectSourceFilter,
} from "../model/selectors";

export function ProjectListView() {
  const { projects, scans, findings, loading } = useDashboard();
  const [search, setSearch] = useState("");
  const [source, setSource] = useState<ProjectSourceFilter>("all");
  const [sort, setSort] = useState<ProjectSort>("updated");
  const visible = useMemo(
    () => filterAndSortProjects(projects, search, source, sort),
    [projects, search, source, sort],
  );

  return (
    <>
      <DashboardPageHeader
        title='Projects'
        description='Manage and analyze your design systems in one place.'
        action={
          <DashboardActionLink href='/dashboard/projects/new'>New project</DashboardActionLink>
        }
      />
      {loading ? (
        <div className='dash-loading'>Loading projects…</div>
      ) : !projects.length ? (
        <DashboardEmptyState
          title='No projects yet.'
          description='Connect a GitHub repository or upload your project files to get started.'
          action={
            <DashboardActionLink href='/dashboard/projects/new'>Create project</DashboardActionLink>
          }
        />
      ) : (
        <>
          <div className='dash-toolbar'>
            <label className='dash-search'>
              <span className='sr-only'>Search projects</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search projects'
              />
            </label>
            <label>
              <span className='sr-only'>Filter by source</span>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as ProjectSourceFilter)}
              >
                <option value='all'>All sources</option>
                <option value='github'>GitHub</option>
                <option value='upload'>Upload</option>
              </select>
            </label>
            <label>
              <span className='sr-only'>Sort projects</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as ProjectSort)}>
                <option value='updated'>Recently updated</option>
                <option value='name'>Name</option>
              </select>
            </label>
          </div>
          {visible.length ? (
            <div className='dash-list'>
              {visible.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  scan={scans.find((s) => s.id === project.lastScanId)}
                  findings={
                    findings.filter((f) => f.projectId === project.id && f.status === "open").length
                  }
                />
              ))}
            </div>
          ) : (
            <DashboardEmptyState
              title='No matching projects.'
              description='Try a different search or source filter.'
            />
          )}
        </>
      )}
    </>
  );
}
