import React, { Suspense, useState, useEffect } from "react";
import { Switch, Redirect } from "react-router-dom";
import PrivateRoute from "components/PrivateRoute";
import { strings } from "res";
import { all_privileges, admin_privileges, verifikator } from "res/privileges/index";
import Loading from "components/shared-components/Loading";

// Pages
import DASHBOARD from "./dashboard";
import CATEGORIES from "./categories";
import CONTENTS from "./contents";
import USERS from "./users";
import PROJECTS from "./projects";
import MY_DAPUR from "./my-dapur";
import OPEN_PROJECTS from "./open-projects";
import FINISHED_PROJECTS from "./finished-projects";
import VERIFICATION_PROJECTS from "./verification-projects";
import VENDORS from "./vendors";
import MY_TARGETS from "./my-targets";
import WAJIB_PAJAK from "./wajib-pajak";
import MY_PROJECTS from "./my-projects";
import SUBCATEGORY from "./subcategories";
import GUARDIAN from "./guardian";
import STUDENT from "./student";
import BILL from "./bill";
import WAGE from "./wage";

// Detail
import DETAIL_CATEGORY from "./detail-category";
import DETAIL_CONTENT from "./detail-content";
import DETAIL_VENDOR from "./detail-vendor";
import DETAIL_PROJECT_VERIFICATION_PROECESS from "./detail-project-verification-process";
import AMBIL_PROJECT from "./ambil-project";
import DETAIL_WAJIB from "./detail-wajib";
import DETAIL_USER from "./detail-user";
import DETAIL_PROJECT_READ_ONLY from "./detail-project-read-only";
import DETAIL_PROJECT_OPD from "./detail-project-opd";
import DETAIL_TAG from "./detail-tag";
import DETAIL_SUBCATEGORY from "./detail-subcategory";
import DETAIL_GUARDIAN from "./detail-guardian";
import DETAIL_STUDENT from "./detail-student";
import DETAIL_BILL from "./detail-bill";

import SETTINGS from "./settings";
import { TAGS } from "./tags";
import TARGET from "./static/target";
import jwt_decode from "jwt-decode";

export const AppViews = ({ match }) => {
  const [privilege, setPrivilege] = useState(2); //ini nanti di sesuiakan lagi #TODO

  useEffect(() => {
    try {
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        const decoded = jwt_decode(token);

        // setPrivilege(decoded.role_id)
        setPrivilege(1); //ini nanti di sesuiakan lagi #TODO
      }
    } catch (err) {
      console.log({ err });
    }
  }, []);

  return (
    <Suspense fallback={<Loading cover="content" />}>
      <Switch>
        <PrivateRoute
          privileges={all_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.dashboard}`}
          component={DASHBOARD}
        />
        <PrivateRoute
          privileges={admin_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.categories}`}
          component={CATEGORIES}
        />
        <PrivateRoute
          privileges={all_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.my_projects}`}
          component={MY_PROJECTS}
        />
        <PrivateRoute
          privileges={all_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.my_dapur}`}
          component={MY_DAPUR}
        />
        <PrivateRoute
          privileges={all_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.student}`}
          component={STUDENT}
        />
        <PrivateRoute
          privileges={all_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.guardian}`}
          component={GUARDIAN}
        />
        <PrivateRoute
          privileges={all_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.bill}`}
          component={BILL}
        />
        <PrivateRoute
          privileges={all_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.wage}`}
          component={WAGE}
        />
        {/* <PrivateRoute
          privileges={all_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.finished_projects}`}
          component={FINISHED_PROJECTS}
        /> */}
        <PrivateRoute
          privileges={admin_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.subcategories}`}
          component={SUBCATEGORY}
        />
        <PrivateRoute
          privileges={verifikator}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.verification_projects}`}
          component={VERIFICATION_PROJECTS}
        />
        <PrivateRoute
          privileges={admin_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.contents}`}
          component={CONTENTS}
        />
        <PrivateRoute
          privileges={all_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.projects}`}
          component={PROJECTS}
        />
        <PrivateRoute
          privileges={all_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.open_projects}`}
          component={OPEN_PROJECTS}
        />
        <PrivateRoute
          privileges={admin_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.wajib_pajak}`}
          component={WAJIB_PAJAK}
        />
        <PrivateRoute
          privileges={admin_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.vendor}`}
          component={VENDORS}
        />
        <PrivateRoute
          privileges={all_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.my_targets}`}
          component={MY_TARGETS}
        />
        <PrivateRoute
          privileges={admin_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.users}`}
          component={USERS}
        />
        <PrivateRoute
          privileges={admin_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.tags}`}
          component={TAGS}
        />

        {/* DETAIL */}
        <PrivateRoute
          privileges={admin_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.detail_content}`}
          component={DETAIL_CONTENT}
        />
        <PrivateRoute
          privileges={admin_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.detail_category}`}
          component={DETAIL_CATEGORY}
        />
        <PrivateRoute
          privileges={admin_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.detail_wajib}`}
          component={DETAIL_WAJIB}
        />
        <PrivateRoute
          privileges={admin_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.detail_vendor}`}
          component={DETAIL_VENDOR}
        />
        <PrivateRoute
          privileges={all_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.detail_student}`}
          component={DETAIL_STUDENT}
        />
        <PrivateRoute
          privileges={all_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.detail_guardian}`}
          component={DETAIL_GUARDIAN}
        />
        <PrivateRoute
          privileges={all_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.detail_bill}`}
          component={DETAIL_BILL}
        />
        <PrivateRoute
          privileges={all_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.detail_project_read_only}`}
          component={DETAIL_PROJECT_READ_ONLY}
        />
        <PrivateRoute
          privileges={verifikator}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.detail_project_verification}`}
          component={DETAIL_PROJECT_VERIFICATION_PROECESS}
        />
        <PrivateRoute
          privileges={all_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.detail_user}`}
          component={DETAIL_USER}
        />
        <PrivateRoute
          privileges={admin_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.detail_tag}`}
          component={DETAIL_TAG}
        />
        <PrivateRoute
          privileges={all_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.detail_project_opd}`}
          component={DETAIL_PROJECT_OPD}
        />
        <PrivateRoute
          privileges={admin_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.detail_subcategory}`}
          component={DETAIL_SUBCATEGORY}
        />
        <PrivateRoute
          privileges={all_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.ambil_project}`}
          component={AMBIL_PROJECT}
        />

        <PrivateRoute
          privileges={all_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.settings}`}
          component={SETTINGS}
        />

        {/* STATIC */}
        <PrivateRoute
          privileges={all_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.static_target}`}
          component={TARGET}
        />

        <Redirect from={`${match.url}`} to={`${strings.navigation.path.dashboard}`} />
      </Switch>
    </Suspense>
  );
};

export default AppViews;
