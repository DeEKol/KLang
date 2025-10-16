import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { TextStyle } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { useAppDispatch } from "app/providers/StoreProvider";
import { getThemeMode, type TThemeMode } from "entities/theme";
import { Colors } from "shared/lib/theme";

import { getCounter } from "../model/selectors/getPosts";
import { fetchPosts } from "../model/slice/postsSlice";

export const Posts = () => {
  const themeMode: TThemeMode = useSelector(getThemeMode);
  const posts = useSelector(getCounter);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const styles = createStyles(themeMode);

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  return (
    <View>
      {posts.status === "resolved" && (
        <View>
          <Text style={styles.textStyle}>{posts.postsArr[0].category}</Text>
          <Text style={styles.textStyle}>{posts.postsArr[0].publishedAt}</Text>
        </View>
      )}
      {posts.status === "loading" && (
        <View>
          <Text style={styles.textStyle}>{t("loading")}</Text>
        </View>
      )}
      {posts.status === "rejected" && (
        <View>
          <Text style={styles.textStyle}>
            {t("Error")}: {posts.error}
          </Text>
        </View>
      )}
    </View>
  );
};

type TPostsStyle = {
  textStyle: TextStyle;
};

const createStyles = (themeMode: TThemeMode) => {
  const styles = StyleSheet.create<TPostsStyle>({
    textStyle: {
      color: Colors[themeMode ?? "light"]?.text,
    },
  });
  return styles;
};
