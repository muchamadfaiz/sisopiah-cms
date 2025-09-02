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
import VENDORS from "./vendors";
import SUBCATEGORY from "./subcategories";
import GUARDIAN from "./guardian";
import STUDENT from "./student";
import BILL from "./bill";
import WAGE from "./wage";

// Detail
import DETAIL_CATEGORY from "./detail-category";
import DETAIL_CONTENT from "./detail-content";
import DETAIL_VENDOR from "./detail-vendor";
import DETAIL_USER from "./detail-user";
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
        <PrivateRoute
          privileges={admin_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.subcategories}`}
          component={SUBCATEGORY}
        />
        <PrivateRoute
          privileges={admin_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.contents}`}
          component={CONTENTS}
        />
        <PrivateRoute
          privileges={admin_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.vendor}`}
          component={VENDORS}
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
          privileges={admin_privileges}
          requiredPrivilege={privilege}
          path={`${strings.navigation.path.detail_subcategory}`}
          component={DETAIL_SUBCATEGORY}
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
