import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { TextStyle } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { useAppDispatch } from "app/providers/StoreProvider/ui/StoreProvider";
import { getCounter } from "entities/PostsTestApi/model/selectors/getPosts";
import { fetchPosts } from "entities/PostsTestApi/model/slice/postsSlice";
import { Colors } from "shared/lib/theme";
import { getThemeColor } from "shared/lib/theme/model/selectors/getThemeColor/getThemeColor";
import type { TThemeColors } from "shared/lib/theme/types/themeSchema";

export const Posts = () => {
  const theme: TThemeColors = useSelector(getThemeColor);
  const posts = useSelector(getCounter);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const styles = createStyles(theme);

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

const createStyles = (theme: TThemeColors) => {
  const styles = StyleSheet.create<TPostsStyle>({
    textStyle: {
      color: Colors[theme ?? "light"]?.text,
    },
  });
  return styles;
};
